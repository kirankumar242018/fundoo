import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataServiceService } from '../../service/DataService/data-service.service'
import { NoteService } from '../../service/NoteService/note.service';
import { MatSnackBar, MatCard } from '@angular/material';
import { LabelService } from '../../service/LabelService/label.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {formatDate } from '@angular/common';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import{CollaboratorsComponent} from '../../components/collaborators/collaborators.component'

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})

export class IconComponent implements OnInit {
  // isdeleted = true;
  constructor(public dataService: DataServiceService, public noteService: NoteService, private snackBar: MatSnackBar,
    private labelService:LabelService,public dialog: MatDialog) { 
      //this.jstoday = formatDate(this.today, "dddd, mmmm dS, yyyy, h:MM:ss TT", 'en-US', '+0530');

    }
  color=[['#FFFFFF','#f28b82','#fbbc04','#fff475'],['#ccff90','#a7ffeb','#cbf0f8','#aecbfa'],['#d7aefb','#fdcfe8','#e6c9a8','#e8eaed']];
  allLabels=[]
  getLabels=[]
  //searchLabel:string;
  
  ngOnInit() {
    this.getNoteLabels()
    console.log('Child meassage..!',this.childMessage)
  }
  search:string;
  datetimepick:[];
  @Input() childMessage;
  @Input() receivedLabels;
  @Output() reloadEvent =  new EventEmitter<any>();
  @Output() colorChange = new EventEmitter<any>();
  userid=localStorage.getItem('userId')

  // today= new Date();
  // jstoday = '';
 

  
  collaborator(childMessage): void{
    const dialogRef = this.dialog.open(CollaboratorsComponent,{
      width:'50%',
      data: {childMessage}
    })
  }

  trashNote() {
    var contents = {
      noteIdList: [this.childMessage['id']],
      isDeleted: true
    }
    this.noteService.deleteNote('notes/trashNotes', contents).subscribe(data => {
      console.log(data);
      this.dataService.changeMessage({
        data:{},
        type:'trash'
      })
      
      this.snackBar.open("Note moved to trash Successfully..", "close", {
        duration: 3000,
      });
    },
      err => {
        console.log(err)
      })
  }
  archiveNote(){
    var contents = {
      noteIdList:[this.childMessage['id']],
      isArchived:true
    }
    this.noteService.archiveNote('notes/archiveNotes',contents).subscribe(data=>{
      console.log(data);
      this.dataService.changeMessage({
        data:{},
        type:'archive'
      })

      this.snackBar.open("Note archived successfully...","close",{duration:3000,});
    },
    err=>{
      console.log(err)
    })

  }
  // unArchiveNote(){
  //   var contents = {
  //     noteIdList:[this.childMessage['id']],
  //     isArchived:false
  //   }
  //   this.noteService.archiveNote('notes/archiveNotes',contents).subscribe(data=>{
  //     console.log(data);
  //     this.dataService.changeMessage({
  //       data:{},
  //       type:'unArchive'
  //     })

  //     this.snackBar.open("Note Updated successfully...","close",{duration:3000,});
  //   },
  //   err=>{
  //     console.log(err)
  //   })

  // }
  changeColor(color){
    console.log("note details",color)

    console.log("note color",color)
    

    if (this.childMessage == undefined){
      this.colorChange.emit(color)
    }
    else{
    this.childMessage.color = color
    var contents = {
      noteIdList:[this.childMessage['id']],
      color:color
    }
      this.noteService.noteColorChange('notes/changesColorNotes',contents).subscribe(data=>{
        console.log(data);
        // this.snackBar.open('Note color changed suceesfully...',"close",{duration:2000,});
      },
      err=>{
        console.log(err)
      })
    }
    

  }
  getNoteLabels(){
    this.labelService.getLabel().subscribe(data=>{
      console.log("labels data...",data)
      this.allLabels = data['data']['details'];
      this.getLabels = this.allLabels.reverse();
      console.log("get labels..",this.getLabels)

    },
    err=>{
      console.log(err)
    });
  }
  addLabelToNotes(labelid){
    var contents={
      noteId:[this.childMessage['id']],
      lableId:labelid
    }
    this.noteService.addLabeltoNote('notes/'+contents.noteId+'/addLabelToNotes/'+contents.lableId+'/add',contents).subscribe(data=>{
      console.log('addLabel contents',data)
      this.reloadEvent.emit()
      this.snackBar.open("Label Added to Note successfully...","close",{duration:3000,});

    },
    err=>{
      console.log(err)
    });
    
  }
  setRemainder(datetimepick){
    
    var contents={
      reminder:[datetimepick],
      noteIdList:[this.childMessage['id']],
      userId:this.userid
    }
    console.log("icon date and time values...!",datetimepick)
    this.noteService.addRemainder('notes/addUpdateReminderNotes',contents).subscribe(data=>{
      console.log("remainder date and time...!",data)
      this.dataService.changeMessage({
        data:{},
        type:'setRemainder'
      })
      this.snackBar.open("remainder added to Note successfully...","close",{duration:3000,});

    })

  }
  setRemainderToday(){
    var todayDate = new Date();
    todayDate.setHours(20,0,0)
    var contents={
      reminder:[todayDate],
      noteIdList:[this.childMessage['id']],
      userId:this.userid
    }
    this.noteService.addRemainder('notes/addUpdateReminderNotes',contents).subscribe(data=>{
      console.log("remainder dtae and time...!",data)
      this.dataService.changeMessage({
        data:{},
        type:'setRemainderToday'
      })
      this.snackBar.open("today remainder added to Note successfully...","close",{duration:3000,});

    })

    
  }
  setRemainderTommorow(){
    var today = new Date();
    var tommorow=new Date(today.setDate(today.getDate() + 1));
    tommorow.setHours(20,0,0)
    var contents={
      reminder:[tommorow],
      noteIdList:[this.childMessage['id']],
      userId:this.userid
    }
    this.noteService.addRemainder('notes/addUpdateReminderNotes',contents).subscribe(data=>{
      console.log("remainder date and time...!",data)
      this.dataService.changeMessage({
        data:{},
        type:'setRemainderTommorow'
      })
      this.snackBar.open("tommorow remainder added to Note successfully...","close",{duration:3000,});

    })

  }

  setRemainderNextWeek(){
    var today = new Date();
    var nextWeek = new Date(today.setDate(today.getDate() + 7));
    nextWeek.setHours(20,0,0);
    var contents={
      reminder:[nextWeek],
      noteIdList:[this.childMessage['id']],
      userId:this.userid
    }
    this.noteService.addRemainder('notes/addUpdateReminderNotes',contents).subscribe(data=>{
      console.log("remainder date and time...!",data)
      this.dataService.changeMessage({
        data:{},
        type:'setRemainderNextWeek'
      })
      this.snackBar.open("NextWeek Remainder added to Note Succesfully....!","close",{duration:3000,});
    })

  }

}
