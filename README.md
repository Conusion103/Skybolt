# SkyBolt – Sports Venue Booking Management System

## Project Overview

**SkyBolt** is an interactive mobile-focused application designed to streamline the booking of sports venues such as football fields, basketball courts, and volleyball courts. It enhances the utilization of sports spaces and reduces wait times through a smart turn-based system and online payments.

---

## General Objective

Develop a mobile-first app that allows users to reserve sports venues efficiently, minimizing idle time and enhancing the user experience through scheduled bookings and prepayments.

---

## Specific Objectives

- Allow administrators to manage users and venue owners to optimize space usage.
- Enable venue owners to register, manage availability, and set schedules.
- Integrate an online payment system for quick and secure transactions.
- Automatically release bookings if users don’t arrive within 20 minutes, triggering promotions.
- Allow users to rate and review venues. *(Bonus feature)*
- Implement data analysis using Python to detect peak hours, adjust pricing, and generate promotions. *(Bonus feature)*
- Display venue locations on a map. *(Bonus feature)*

---

## Problem Statement

In many municipalities, booking sports venues is a manual and inefficient process involving slow online forms and poor scheduling systems. This leads to frustration for users and reduced income for venue owners due to underutilized facilities.

---

## Project Scope

### Included Features:
- Owner registration of venues and schedule management
- User booking and online payments
- Age validation and arrival time enforcement (20-minute threshold)
- Maximum booking time limits
- Promotions for unattended bookings
- Responsive user interface
- Ratings and reviews *(Bonus)*
- Data analysis and reporting *(Bonus)*
- Map-based venue location display *(Bonus)*

---

## User Stories (Selected Highlights)

- **HU1-HU3:** Secure login, logout, and password recovery
- **HU4-HU6:** Venue registration and schedule management for owners
- **HU7-HU8:** User registration and role-based access
- **HU9-HU10:** Admin and user profile management
- **HU11-HU14:** Dashboards and calendar view for bookings
- **HU15-HU17:** Bookings, cancellations, and notifications
- **HU18-HU24:** Full CRUD operations for users, owners, and venues by admin
- **HU25:** Owner request submission by regular users

> For a detailed list, see `/docs/user-stories.md` *(if applicable)*

---

## SCRUM Methodology

- **Product Owner:** Jorge Henriquez Novoa  
- **Scrum Master:** Nikol Velásquez  
- **Development Team:** Isai Ariza & David Vargas

### Tools:
- Azure DevOps  
- Figma  
- GitHub  

### Sprint Breakdown:
1. Planning & Analysis  
2. Design & Development  
3. Development & Testing  
4. Final Delivery & Presentation

---

## Diagrams

- Entity-Relationship Model  
- Component Diagram  
- Navigation Flow Diagram

---

## Tech Stack

- **Frontend:** HTML, CSS, TailwindCSS, Vanilla JavaScript  
- **Backend:** Node.js, Express  
- **Database:** MySQL  
- **Version Control:** Git, GitHub  
- **Methodology:** SCRUM using Azure DevOps  

---

## Installation Guide

### Prerequisites:
- Node.js v18+  
- MySQL 8+  
- Git

### Setup Steps:

```bash
# 1. Clone the repository
git clone https://github.com/Conusion103/Skybolt.git
cd skybolt

# 2. Backend Setup
npm install
npm run start

# 3. Database Configuration
- Import the SQL script found in /database/skybolt.sql
- Edit the .env file with your MySQL credentials

# 4. Frontend
npm run dev

# 5. Access the App
Open your browser at http://localhost:3000
```
### Benefits
* Efficient venue management for owners and admins

* Reduced user waiting times and idle slots

* Increased revenue for both public and private venue owners

* Promotion of sports through a modern digital experience

### Future Enhancements
* Push/email notifications for booking reminders
* AI-based demand prediction for pricing and scheduling
* Expansion to more sports venues (gyms, swimming pools, etc.)

### Contributors
* Nikol Tatiana Velásquez Ramos
* David Felipe Vargas Varela
* Jorge Alberto Henriquez Novoa
* Isai David Ariza Cantillo
