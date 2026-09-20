CAREFLOW HACKATHON DEMO — HARDENED FRONTEND PROTOTYPE
====================================================

Run
---
Open index.html with VS Code Live Server.

What was fixed
---------------
1. Queue calculation is doctor + hospital + appointment-date specific. Patients on another date are never counted as being ahead.
2. Same-day past time slots are hidden. A patient cannot book a time that has already passed today.
3. Waiting time now uses the selected doctor's real consultation duration (20/30 minutes) instead of a fixed 5 minutes. Future-date appointments show Scheduled rather than a misleading live wait.
4. Daily capacity is calculated from the actual hospital hours, lunch break and consultation duration. There is no separate hard-coded capacity that can disagree with the generated slots.
5. Duplicate active booking is blocked for the same patient identity (name + phone).
6. Emergency handling is no longer presented as automatic direct-to-doctor care. It creates an Emergency — Pending Triage request. Reception can triage it to either Emergency Department or Urgent Doctor Review.
7. Emergency Department cases are removed from the normal doctor queue; verified urgent doctor cases remain clearly separated from normal appointments.
8. A doctor console was added for today's doctor-specific queue with Call Next, Patient Arrived, Missed and Consultation Complete actions.
9. Patient My Queue now shows an arrival plan and a more realistic estimated wait.
10. Patient/reception screens explicitly label localStorage and frontend login as demo-only instead of claiming production security.
11. Reception is locked to the authenticated demo hospital session and queue filtering is hospital-specific.
12. Cancelled, completed, missed, exited and emergency-department records are excluded from active operational queues.

Emergency demo flow
--------------------
Patient
  -> Urgent / emergency request
  -> Emergency — Pending Triage
  -> Reception Triage
       -> Emergency Department
       OR
       -> Urgent Doctor Review

Important healthcare note
-------------------------
CareFlow is a hackathon prototype, not a clinical triage system. The triage choices are workflow demonstrations only and must not be used to make medical decisions. Life-threatening symptoms should be directed to the hospital emergency department / local emergency services according to the hospital's real protocol.

Demo receptionist credentials
-----------------------------
H01 Apollo Care Hospital: apollo123
H02 KIMS City Hospital: kims123
H03 CARE Multispeciality: care123
H04 Yashoda Hospitals: yashoda123
H05 Continental Hospitals: continental123
H06 Sunshine Hospitals: sunshine123
H07 AIG Hospitals: aig123
H08 Medicover Hospitals: medicover123
H09 Star Hospitals: star123
H10 Virinchi Hospitals: virinchi123

These credentials are intentionally demo credentials. They are still visible to a user who inspects frontend JavaScript, so this prototype does NOT provide real authentication.

Production architecture still required
---------------------------------------
For real deployment, move patient data, authentication, authorization and queue state to a backend/database. Use password hashing, secure sessions/OTP, TLS, server-side hospital/role authorization, audit logs, encrypted storage and an approved clinical emergency workflow. Do not use this static prototype with real patient data.

Files
-----
index.html       Landing page / hospitals
patient.html     Appointment booking
myqueue.html     Patient live queue
receptionist.html Reception demo console
doctor.html      Doctor workflow demo
queue.html       Compatibility redirect
script.js        Queue/booking engine
style.css        UI styles


Booking slot fix: when the current time is past hospital closing time, the booking page automatically selects the next day so valid future slots are available. Same-day bookings still hide slots that have already passed. Lunch break remains excluded and doctor-specific durations/capacities are preserved.


Doctor Console update: select a doctor and appointment date to view that doctor's active queue for the selected date. Verified emergency cases appear only when viewing today.
