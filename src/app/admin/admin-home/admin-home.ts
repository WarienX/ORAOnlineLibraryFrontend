import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.scss',
})
export class AdminHome {
  today = new Date();

  stats = signal({
    totalStudents: 248,
    totalTeachers: 32,
    totalClasses: 18,
    pendingRequests: 7
  })

  recentActivities = signal([
    {
      icon: 'person_add',
      text: 'New student "Aryan Sharma" was registered',
      time: '2 hours ago'
    },
    {
      icon: 'campaign',
      text: 'Announcement published: Parent-Teacher Meeting',
      time: '5 hours ago'
    },
    {
      icon: 'class',
      text: 'Class "Grade 5 - A" schedule updated',
      time: 'Yesterday'
    },
    {
      icon: 'check_circle',
      text: 'Teacher "Ms. Fernandes" approved leave request',
      time: 'Yesterday'
    }
  ])
}
