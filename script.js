// =============================
// CAREFLOW — SMART QUEUE ENGINE
// =============================

const hospitals = [
 {id:"H01",name:"Apollo Care Hospital",city:"Hyderabad",icon:"🏥",doctors:[
  ["Dr. Priya Sharma","General Medicine"],["Dr. Arjun Rao","Cardiology"],["Dr. Neha Reddy","Dermatology"],["Dr. Kiran Kumar","Neurology"],["Dr. Ananya Das","Pediatrics"],["Dr. Vivek Shah","Orthopedics"]]},
 {id:"H02",name:"KIMS City Hospital",city:"Hyderabad",icon:"🏨",doctors:[
  ["Dr. Rahul Mehta","General Medicine"],["Dr. Sneha Iyer","Cardiology"],["Dr. Meera Rao","Gynecology"],["Dr. Ajay Varma","Orthopedics"],["Dr. Kavya Nair","Pediatrics"],["Dr. Rohan Singh","ENT"]]},
 {id:"H03",name:"CARE Multispeciality",city:"Hyderabad",icon:"✚",doctors:[
  ["Dr. Anil Reddy","General Medicine"],["Dr. Swathi Rao","Cardiology"],["Dr. Pooja Menon","Dermatology"],["Dr. Varun Jain","Neurology"],["Dr. Ishita Roy","Pediatrics"],["Dr. Mohan Das","ENT"]]},
 {id:"H04",name:"Yashoda Hospitals",city:"Hyderabad",icon:"⚕️",doctors:[
  ["Dr. Ramesh Rao","General Medicine"],["Dr. Aditi Shah","Cardiology"],["Dr. Nikhil Varma","Neurology"],["Dr. Harsha Reddy","Orthopedics"],["Dr. Divya Jain","Pediatrics"],["Dr. Suresh Kumar","Gastroenterology"]]},
 {id:"H05",name:"Continental Hospitals",city:"Hyderabad",icon:"🩺",doctors:[
  ["Dr. Mehul Patel","General Medicine"],["Dr. Saanvi Rao","Cardiology"],["Dr. Tara Iyer","Dermatology"],["Dr. Rohit Das","Neurology"],["Dr. Nandini Shah","Pediatrics"],["Dr. Aditya Menon","Orthopedics"]]},
 {id:"H06",name:"Sunshine Hospitals",city:"Hyderabad",icon:"☀️",doctors:[
  ["Dr. Varun Rao","General Medicine"],["Dr. Riya Sharma","Cardiology"],["Dr. Nisha Kumar","Gynecology"],["Dr. Akhil Reddy","Orthopedics"],["Dr. Farah Ali","Pediatrics"],["Dr. Karthik Jain","ENT"]]},
 {id:"H07",name:"AIG Hospitals",city:"Hyderabad",icon:"🔬",doctors:[
  ["Dr. Sandeep Rao","General Medicine"],["Dr. Lakshmi Iyer","Cardiology"],["Dr. Nitin Shah","Gastroenterology"],["Dr. Rupa Menon","Neurology"],["Dr. Vikas Jain","Orthopedics"],["Dr. Tanya Roy","Dermatology"]]},
 {id:"H08",name:"Medicover Hospitals",city:"Hyderabad",icon:"💙",doctors:[
  ["Dr. Abhinav Reddy","General Medicine"],["Dr. Shreya Das","Cardiology"],["Dr. Preeti Rao","Pediatrics"],["Dr. Manish Kumar","Neurology"],["Dr. Alisha Shah","ENT"],["Dr. Gaurav Jain","Orthopedics"]]},
 {id:"H09",name:"Star Hospitals",city:"Hyderabad",icon:"⭐",doctors:[
  ["Dr. Naveen Rao","General Medicine"],["Dr. Keerthi Reddy","Cardiology"],["Dr. Rachana Iyer","Dermatology"],["Dr. Siddharth Das","Neurology"],["Dr. Monica Shah","Pediatrics"],["Dr. Abhay Jain","Orthopedics"]]},
 {id:"H10",name:"Virinchi Hospitals",city:"Hyderabad",icon:"🌿",doctors:[
  ["Dr. Ashwin Rao","General Medicine"],["Dr. Ritu Sharma","Cardiology"],["Dr. Harini Das","Gynecology"],["Dr. Sameer Jain","Neurology"],["Dr. Bhavana Roy","Pediatrics"],["Dr. Tejas Reddy","Orthopedics"]]}
];


const receptionistPasswords = {
 H01:"apollo123",
 H02:"kims123",
 H03:"care123",
 H04:"yashoda123",
 H05:"continental123",
 H06:"sunshine123",
 H07:"aig123",
 H08:"medicover123",
 H09:"star123",
 H10:"virinchi123"
};

// Doctor-specific consultation schedules. Each doctor can have a different
// consultation duration and therefore a different number of normal appointments per day.
// General Medicine is intentionally faster (20 min) than longer specialist consultations (30 min).
const DOCTOR_SCHEDULES={
 "General Medicine":{minutes:20},
 "Dermatology":{minutes:20},
 "Pediatrics":{minutes:20},
 "ENT":{minutes:20},
 "Cardiology":{minutes:30},
 "Neurology":{minutes:30},
 "Gynecology":{minutes:30},
 "Orthopedics":{minutes:30},
 "Gastroenterology":{minutes:30}
};
const hospitalHours={start:"09:00 AM",end:"05:00 PM"};
const hospitalLunch={start:"12:30 PM",end:"02:00 PM"};
function getDoctorSchedule(specialty){
 const base=DOCTOR_SCHEDULES[specialty]||{minutes:30};
 const capacity=generateDoctorSlotsRaw(base.minutes).length;
 return {...base,capacity};
}
function generateDoctorSlotsRaw(step){
 const start=timeToMinutes(hospitalHours.start),end=timeToMinutes(hospitalHours.end);
 const lunchStart=timeToMinutes(hospitalLunch.start),lunchEnd=timeToMinutes(hospitalLunch.end);
 const result=[];
 for(let t=start;t+step<=end;t+=step){
  if(t<lunchEnd && t+step>lunchStart) continue;
  result.push(formatTime(t));
 }
 return result;
}
function formatTime(minutes){
 let h=Math.floor(minutes/60),m=minutes%60; const suffix=h>=12?"PM":"AM"; h=h%12||12;
 return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} ${suffix}`;
}
function generateDoctorSlots(specialty){return generateDoctorSlotsRaw(getDoctorSchedule(specialty).minutes);}
function timeToMinutes(value){
 if(!value||value==="Immediate")return Number.MAX_SAFE_INTEGER;
 const m=value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
 if(!m)return Number.MAX_SAFE_INTEGER;
 let h=Number(m[1])%12;if(m[3].toUpperCase()==="PM")h+=12;
 return h*60+Number(m[2]);
}
function isLunchSlot(value){
 const t=timeToMinutes(value);
 return t>=timeToMinutes(hospitalLunch.start) && t<timeToMinutes(hospitalLunch.end);
}

function todayISO(){const d=new Date();const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,"0");const day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`}
function addDaysISO(days){const d=new Date();d.setDate(d.getDate()+days);const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,"0");const day=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${day}`}
function nextBookingDateISO(){const now=nowMinutes();const end=timeToMinutes(hospitalHours.end);return now>=end?addDaysISO(1):todayISO()}
function nowMinutes(){const d=new Date();return d.getHours()*60+d.getMinutes();}
function isActiveStatus(status){return !["Completed","Missed","Cancelled","Exited","Emergency — Emergency Department"].includes(status);}
function sameDoctorDay(p,me){return p.hospitalId===me.hospitalId&&p.doctor===me.doctor&&p.appointmentDate===me.appointmentDate&&!p.emergency&&isActiveStatus(p.status);}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));}
function formatAppointmentDate(value){
 if(!value)return "—";
 const d=new Date(value+"T00:00:00");
 return d.toLocaleDateString([], {day:"2-digit",month:"short",year:"numeric"});
}

function getQueue(){return JSON.parse(localStorage.getItem("careflowQueue")||"[]")}
function saveQueue(q){localStorage.setItem("careflowQueue",JSON.stringify(q))}
function nextNumber(){let n=Number(localStorage.getItem("careflowLastToken")||100)+1;localStorage.setItem("careflowLastToken",n);return n}

function initHome(){
 const grid=document.getElementById("hospitalGrid"); if(!grid)return;
 grid.innerHTML=hospitals.map(h=>`<article class="hospital-card"><div class="hospital-icon">${h.icon}</div><div><h3>${h.name}</h3><p>${h.city} • ${h.doctors.length} doctors available</p></div><a class="btn small" href="patient.html?hospital=${h.id}">Select →</a></article>`).join("");
}

function initBooking(){
 const form=document.getElementById("bookingForm"); if(!form)return;
 const hospitalSel=document.getElementById("hospital"), doctorSel=document.getElementById("doctor"), dateInput=document.getElementById("appointmentDate"), slotSel=document.getElementById("slot");
 const emergencyInput=document.getElementById("emergency"), dateField=document.getElementById("dateField"), slotField=document.getElementById("slotField");
 const ageInput=document.getElementById("age"), genderInput=document.getElementById("gender");
 const nameInput=document.getElementById("name"), previewDate=document.getElementById("previewDate"), previewPatient=document.getElementById("previewPatient");
 hospitalSel.innerHTML='<option value="">Choose hospital</option>'+hospitals.map(h=>`<option value="${h.id}">${h.name}</option>`).join("");
 dateInput.min=todayISO();
 dateInput.value=nextBookingDateISO();
 if(previewDate) previewDate.textContent=formatAppointmentDate(dateInput.value);
 const params=new URLSearchParams(location.search); const initial=params.get("hospital");

 function updateSlots(){
  const hospitalId=hospitalSel.value, doctorIndex=doctorSel.value, emergency=emergencyInput.checked;
  const h=hospitals.find(x=>x.id===hospitalId), d=h&&h.doctors[Number(doctorIndex)];
  const schedule=d?getDoctorSchedule(d[1]):null;
  const doctorSlots=d?generateDoctorSlots(d[1]):[];
  const bookedPatients=getQueue().filter(p=>p.hospitalId===hospitalId && p.doctor===d?.[0] && p.appointmentDate===dateInput.value && !["Cancelled","Completed","Exited","Missed"].includes(p.status) && !p.emergency);
  const booked=bookedPatients.map(p=>p.slot);
  const available=doctorSlots.filter(slot=>!booked.includes(slot) && (dateInput.value!==todayISO() || timeToMinutes(slot)>nowMinutes()));
  slotSel.innerHTML='<option value="">Choose time slot</option>'+available.map(slot=>`<option>${slot}</option>`).join("");
  slotSel.disabled=emergency;
  slotSel.required=!emergency;
  if(!emergency && d && bookedPatients.length>=schedule.capacity) slotSel.innerHTML='<option value="">Daily capacity reached — emergency only</option>';
  else if(!emergency && d && available.length===0) slotSel.innerHTML='<option value="">No slots available for this doctor</option>';
  const hint=document.querySelector("#slotField .field-hint");
  if(hint && d) hint.textContent=`${schedule.minutes}-minute slots • ${schedule.capacity} normal appointments/day • Lunch break: 12:30 PM–2:00 PM`;
 }

 function updateDoctors(){
  const h=hospitals.find(x=>x.id===hospitalSel.value);
  doctorSel.innerHTML='<option value="">Choose doctor</option>'+(h?h.doctors.map((d,i)=>`<option value="${i}">${d[0]} — ${d[1]}</option>`).join(""):"");
  document.getElementById("previewHospital").textContent=h?h.name:"Select a hospital";
  document.getElementById("previewDoctor").textContent=h?"Choose a doctor to continue":"Choose a doctor to continue";
  updateSlots();
 }
 function updatePatientPreview(){
  if(previewPatient) previewPatient.textContent=nameInput.value.trim()||"—";
 }
 function setEmergencyMode(isEmergency){
  dateInput.disabled=isEmergency;
  dateInput.required=!isEmergency;
  slotSel.disabled=isEmergency;
  slotSel.required=!isEmergency;
  if(dateField) dateField.classList.toggle("disabled-field",isEmergency);
  if(slotField) slotField.classList.toggle("disabled-field",isEmergency);
  document.getElementById("previewType").textContent=isEmergency?"Emergency • Direct doctor":"Standard";
  if(isEmergency){
   dateInput.value="";
   slotSel.value="";
   if(previewDate) previewDate.textContent="Emergency — immediate";
  }else{
   dateInput.value=nextBookingDateISO();
   if(previewDate) previewDate.textContent=formatAppointmentDate(dateInput.value);
  }
  updateSlots();
 }
 if(initial){hospitalSel.value=initial;updateDoctors()}
 hospitalSel.addEventListener("change",updateDoctors);
 doctorSel.addEventListener("change",()=>{
  const h=hospitals.find(x=>x.id===hospitalSel.value),d=h&&h.doctors[Number(doctorSel.value)];
  document.getElementById("previewDoctor").textContent=d?`${d[0]} • ${d[1]}`:"Choose a doctor to continue";
  const previewCapacity=document.getElementById("previewCapacity"),previewDuration=document.getElementById("previewDuration");
  if(previewCapacity) previewCapacity.textContent=d?`${getDoctorSchedule(d[1]).capacity} patients`:"—";
  if(previewDuration) previewDuration.textContent=d?`${getDoctorSchedule(d[1]).minutes} min`:"—";
  updateSlots();
 });
 emergencyInput.addEventListener("change",e=>setEmergencyMode(e.target.checked));
 dateInput.addEventListener("change",()=>{
  if(dateInput.value<todayISO()){dateInput.value=nextBookingDateISO();alert("Appointment date cannot be in the past. The next available booking date has been selected.");}
  if(previewDate) previewDate.textContent=formatAppointmentDate(dateInput.value);
  updateSlots();
 });
 nameInput.addEventListener("input",updatePatientPreview);
 form.addEventListener("submit",e=>{
  e.preventDefault();
  const h=hospitals.find(x=>x.id===hospitalSel.value),d=h&&h.doctors[Number(doctorSel.value)];
  const emergency=emergencyInput.checked;
  if(!h||!d){alert("Please choose a hospital and doctor.");return;}
  const name=nameInput.value.trim(), phone=document.getElementById("phone").value.trim(), age=Number(ageInput.value), gender=genderInput.value;
  if(!name){alert("Please enter the patient's name.");return;}
  if(!/^[0-9]{10}$/.test(phone)){alert("Please enter a valid 10-digit phone number.");return;}
  if(!Number.isInteger(age)||age<0||age>120){alert("Please enter a valid age between 0 and 120.");return;}
  if(!gender){alert("Please select the patient's gender.");return;}
  if(!emergency && !dateInput.value){alert("Please choose an appointment date.");return;}
  if(!emergency && dateInput.value<todayISO()){alert("Appointment date cannot be in the past.");return;}
  if(!emergency && !slotSel.value){alert("Please choose an available time slot for the selected doctor.");return;}
  if(!emergency && isLunchSlot(slotSel.value)){alert("That time falls in the hospital lunch break. Please choose another slot.");return;}
  const schedule=getDoctorSchedule(d[1]);
  const active=getQueue().filter(p=>p.name.trim().toLowerCase()===name.toLowerCase() && p.phone===phone && isActiveStatus(p.status));
  if(active.length){alert("This patient already has an active CareFlow appointment. Cancel or complete it before creating another active booking.");return;}
  if(!emergency){
   const sameDoctorDay=getQueue().filter(p=>p.hospitalId===h.id && p.doctor===d[0] && p.appointmentDate===dateInput.value && !p.emergency && !["Cancelled","Completed","Exited","Missed"].includes(p.status));
   if(sameDoctorDay.length>=schedule.capacity){alert(`This doctor has reached the daily capacity of ${schedule.capacity} normal appointments for the selected date. Emergency consultations are still accepted. Please choose another date or doctor.`);updateSlots();return;}
   if(sameDoctorDay.some(p=>p.slot===slotSel.value)){alert("That time slot was just booked by another patient. Please choose another available time.");updateSlots();return;}
  }
  const token=(emergency?"E":"A")+nextNumber();
  const patient={
   id:Date.now(),token,name,phone,age,gender,hospitalId:h.id,hospital:h.name,doctor:d[0],specialty:d[1],
   appointmentDate:emergency?"":dateInput.value,slot:emergency?"Immediate":slotSel.value,emergency,
   status:emergency?"Emergency — Pending Triage":"Waiting",createdAt:new Date().toISOString()
  };
  const q=getQueue();
  patient.queuePosition=q.reduce((max,x)=>Math.max(max,Number(x.queuePosition)||0),0)+1;
  if(patient.emergency) q.unshift(patient); else q.push(patient);
  saveQueue(q);
  localStorage.setItem("careflowCurrent",JSON.stringify(patient));
  location.href="myqueue.html";
 });
 updateDoctors();
 setEmergencyMode(false);
}
function initQueue(){
 const content=document.getElementById("queueContent");if(!content)return;
 const login=document.getElementById("queueLogin"),form=document.getElementById("queueLoginForm");
 const hospitalSel=document.getElementById("queueLoginHospital"),nameInput=document.getElementById("queueLoginName");
 const passwordInput=document.getElementById("queueLoginPassword"),error=document.getElementById("queueLoginError"),empty=document.getElementById("queueEmpty");
 hospitalSel.innerHTML='<option value="">Choose hospital</option>'+hospitals.map(h=>`<option value="${h.id}">${h.name}</option>`).join("");

 function findAppointment(hospitalId,name,phone){
  const q=getQueue(),normalized=name.trim().toLowerCase(),normalizedPhone=phone.trim();
  const matches=q.filter(p=>p.hospitalId===hospitalId && p.name.trim().toLowerCase()===normalized && p.phone===normalizedPhone && !["Cancelled","Completed","Exited"].includes(p.status));
  return matches.length?matches[matches.length-1]:null;
 }
 function showQueue(patient){
  localStorage.setItem("careflowCurrent",JSON.stringify(patient));
  sessionStorage.setItem("careflowQueueAccess",JSON.stringify({hospitalId:patient.hospitalId,name:patient.name,phone:patient.phone}));
  if(login)login.classList.add("hidden"); if(empty)empty.classList.add("hidden"); content.classList.remove("hidden");
  refreshQueueView(patient); clearInterval(window.careflowQueueTimer);
  window.careflowQueueTimer=setInterval(()=>refreshQueueView(patient),2000);
 }
 function checkSavedAccess(){
  const access=JSON.parse(sessionStorage.getItem("careflowQueueAccess")||"null"); if(!access)return false;
  const patient=findAppointment(access.hospitalId,access.name,access.phone);
  if(patient){showQueue(patient);return true;}
  sessionStorage.removeItem("careflowQueueAccess"); return false;
 }
 if(form)form.addEventListener("submit",e=>{
  e.preventDefault();
  const hospitalId=hospitalSel.value,name=nameInput.value.trim(),phone=passwordInput.value.trim();
  const patient=findAppointment(hospitalId,name,phone);
  if(!/^[0-9]{10}$/.test(phone)){error.textContent="Your My Queue password must be the same 10-digit phone number used during booking.";error.classList.remove("hidden");return;}
  if(!patient){error.textContent="The hospital, name or phone number does not match an active appointment.";error.classList.remove("hidden");return;}
  error.classList.add("hidden");showQueue(patient);
 });
 if(!checkSavedAccess()){content.classList.add("hidden");if(empty)empty.classList.add("hidden");if(login)login.classList.remove("hidden");}
}
function refreshQueueView(current){
 const q=getQueue(),me=q.find(p=>p.id===current.id)||current;
 const emergencyDirect=me.emergency;
 const isCancelled=me.status==="Cancelled";
 const isCompleted=me.status==="Completed";
 const isMissed=me.status==="Missed";
 const activePatients=q.filter(p=>sameDoctorDay(p,me)).sort((a,b)=>timeToMinutes(a.slot)-timeToMinutes(b.slot)||(a.queuePosition||0)-(b.queuePosition||0));
 const ahead=q.filter(p=>sameDoctorDay(p,me)&&p.id!==me.id&&timeToMinutes(p.slot)<timeToMinutes(me.slot));
 const aheadCount=(emergencyDirect||isCancelled||isCompleted||isMissed)?0:ahead.length;
 const position=(emergencyDirect||isCancelled||isCompleted||isMissed)?"—":((activePatients.findIndex(p=>p.id===me.id)+1)||"—");

 document.getElementById("qHospital").textContent=me.hospital;
 document.getElementById("qDoctor").textContent=`${me.doctor} • ${me.specialty}`;
 document.getElementById("qToken").textContent=me.token;
 document.getElementById("qName").textContent=me.name;

 document.getElementById("qAhead").textContent=(emergencyDirect||isCancelled||isCompleted||isMissed)?"—":aheadCount;
 const positionEl=document.getElementById("qPosition");
 if(positionEl) positionEl.textContent=position;
 let waitText="—";
 if(emergencyDirect) waitText=me.status==="Emergency — Pending Triage"?"Triage required":(me.status==="Emergency — Emergency Department"?"Emergency care":"Urgent care");
 else if(isCancelled) waitText="Cancelled";
 else if(isCompleted) waitText="Completed";
 else if(isMissed) waitText="Missed — reschedule";
 else if(me.appointmentDate>todayISO()) waitText="Scheduled";
 else { const duration=getDoctorSchedule(me.specialty).minutes; waitText=`≈ ${aheadCount*duration} min`; }
 document.getElementById("qWait").textContent=waitText;
 document.getElementById("progress").style.width=(emergencyDirect||isCancelled||isCompleted||isMissed)?"100%":Math.max(8,100-aheadCount*12)+"%";

 document.getElementById("detailDoctor").textContent=me.doctor+" • "+me.specialty;
 const ageGender=document.getElementById("detailAgeGender");
 if(ageGender) ageGender.textContent=`${me.age ?? "—"} years • ${me.gender || "—"}`;
 const detailDate=document.getElementById("detailDate");
 if(detailDate) detailDate.textContent=emergencyDirect?"Emergency — immediate":formatAppointmentDate(me.appointmentDate);
 document.getElementById("detailSlot").textContent=emergencyDirect?"Immediate consultation":me.slot;
 document.getElementById("detailType").textContent=emergencyDirect?"Urgent request":"Standard";
 const arrival=document.getElementById("arrivalPlan");
 if(arrival){
  if(emergencyDirect) arrival.textContent=me.status==="Emergency — Emergency Department"?"Follow emergency-department instructions":"Wait for hospital triage instructions";
  else if(me.appointmentDate===todayISO()) arrival.textContent=`Suggested arrival: ${formatTime(Math.max(timeToMinutes(me.slot)-10, timeToMinutes("09:00 AM")))}`;
  else arrival.textContent=`Suggested arrival: 10 minutes before ${me.slot}`;
 }

 const status=document.getElementById("qStatus");
 status.textContent="● "+me.status;
 status.className="status-pill "+(emergencyDirect?"emergency-status":(isCancelled?"cancelled-status":(isCompleted?"completed-status":(isMissed?"missed-status":""))));

 const notice=document.getElementById("emergencyNotice");
 if(emergencyDirect){
  notice.textContent=me.status==="Emergency — Pending Triage"
   ? "🚨 Urgent request received. Hospital reception must perform triage verification. If symptoms are severe or life-threatening, use the hospital emergency department/emergency services rather than waiting for a routine appointment."
   : (me.status==="Emergency — Emergency Department" ? "🚨 Reception directed this request to emergency-department care. Follow the hospital's emergency instructions." : "🚨 Triage verified for urgent doctor review. Follow the hospital desk instructions; this is not a substitute for emergency medical services.");
  notice.classList.remove("hidden");
 }else if(isCancelled){
  notice.textContent="✕ This appointment has been cancelled. It is no longer active and will not appear in the receptionist queue.";
  notice.classList.remove("hidden");
 }else if(isCompleted){
  notice.textContent="✓ Consultation completed. This appointment is no longer in the active queue.";
  notice.classList.remove("hidden");
 }else if(isMissed){
  notice.textContent="⚠️ You missed this appointment. You are no longer in the active queue. Please reschedule a new appointment if you still need to consult the doctor.";
  notice.classList.remove("hidden");
 }else notice.classList.add("hidden");

 const cancelBtn=document.getElementById("cancelAppointmentBtn");
 if(cancelBtn){
  const canCancel=!['Cancelled','Completed','Missed'].includes(me.status);
  cancelBtn.classList.toggle("hidden",!canCancel);
 }

 const smartTitle=document.getElementById("smartQueueTitle");
 const smartText=document.getElementById("smartQueueText");
 if(emergencyDirect){
  smartTitle.textContent=me.status==="Emergency — Pending Triage"?"Emergency triage":"Urgent care direction";
  smartText.textContent=me.status==="Emergency — Pending Triage"
   ? "The hospital desk must triage this request before deciding whether it belongs in emergency care or urgent doctor review."
   : (me.status==="Emergency — Emergency Department" ? "Reception directed this request to emergency-department care. Follow the hospital's emergency instructions." : "Follow the hospital desk triage instruction. A verified urgent request is handled separately from the normal appointment queue.");
 }else if(isCancelled){
  smartTitle.textContent="Appointment cancelled";
  smartText.textContent="This appointment has been cancelled. You can book a new appointment whenever needed.";
 }else if(isCompleted){
  smartTitle.textContent="Consultation completed";
  smartText.textContent="Your consultation is complete. This appointment has been removed from the active waiting queue.";
 }else if(isMissed){
  smartTitle.textContent="Appointment missed";
  smartText.textContent="This appointment was marked as missed and removed from the active queue. Please reschedule a new appointment if you still need care.";
 }else{
  smartTitle.textContent="Smart queue updates";
  smartText.textContent="When reception calls the next patient, your status changes here. Your estimated wait is based on patients ahead at the selected hospital.";
 }
}

function cancelAppointment(id){
 let q=getQueue(),p=q.find(x=>x.id===id);if(!p)return;
 if(["Completed","Missed","Cancelled"].includes(p.status))return;
 if(!confirm("Cancel this appointment? It will be removed from the receptionist queue."))return;
 p.status="Cancelled";
 p.cancelledAt=new Date().toISOString();
 saveQueue(q);
 const current=JSON.parse(localStorage.getItem("careflowCurrent")||"null");
 if(current && current.id===id) localStorage.setItem("careflowCurrent",JSON.stringify(p));
 refreshQueueView(p);
}

function callPatient(id){
 let q=getQueue();
 const p=q.find(x=>x.id===id);
 if(!p)return;
 // Real-time workflow: clicking Call next immediately changes the patient to Called.
 if(!["Waiting","Not Emergency"].includes(p.status))return;
 p.status="Called";
 p.calledAt=new Date().toISOString();
 saveQueue(q);
 const current=JSON.parse(localStorage.getItem("careflowCurrent")||"null");
 if(current && current.id===id) localStorage.setItem("careflowCurrent",JSON.stringify(p));
 loadReceptionistQueue();
}

function chooseCallOutcome(action,id){
 let q=getQueue(),p=q.find(x=>x.id===Number(id));
 if(!p || p.status!=="Called")return;
 if(action==="received") {
  p.status="Consultation Received";
  p.consultationReceivedAt=new Date().toISOString();
 } else if(action==="missed") {
  p.status="Missed — Decision Pending";
  p.missedAt=new Date().toISOString();
 }
 saveQueue(q);
 const current=JSON.parse(localStorage.getItem("careflowCurrent")||"null");
 if(current && current.id===p.id) localStorage.setItem("careflowCurrent",JSON.stringify(p));
 loadReceptionistQueue();
}

function verifyEmergency(id){
 let q=getQueue(),p=q.find(x=>x.id===id);if(!p||!p.emergency)return;
 if(["Completed","Cancelled","Exited","Emergency — Emergency Department"].includes(p.status))return;
 const choice=prompt("Triage action: type DOCTOR for urgent doctor review, or ED for emergency-department direction.","DOCTOR");
 if(!choice)return;
 const action=choice.trim().toUpperCase();
 if(action!=="DOCTOR"&&action!=="ED"){alert("Please enter DOCTOR or ED.");return;}
 if(action==="ED"){
  p.status="Emergency — Emergency Department";
  p.triageOutcome="Emergency department";
  p.verifiedAt=new Date().toISOString();
 }else{
  p.status="Emergency — Verified for Doctor";
  p.triageOutcome="Urgent doctor review";
  p.verifiedAt=new Date().toISOString();
  q=q.filter(x=>x.id!==id);
  q.forEach(x=>{if(x.hospitalId===p.hospitalId)x.queuePosition=(x.queuePosition||0)+1;});
  p.queuePosition=0;
  q.unshift(p);
 }
 saveQueue(q);
 const current=JSON.parse(localStorage.getItem("careflowCurrent")||"null");
 if(current&&current.id===id)localStorage.setItem("careflowCurrent",JSON.stringify(p));
 loadReceptionistQueue();
}

function markConsulted(id){
 let q=getQueue(),p=q.find(x=>x.id===id);if(!p)return;
 p.status="Completed";p.consultedAt=new Date().toISOString();saveQueue(q);loadReceptionistQueue();
}
function markMissed(id){
 const p=getQueue().find(x=>x.id===id);
 if(!p || p.status!=="Called")return;
 chooseCallOutcome("missed",id);
}

function exitPatient(id){
 let q=getQueue(),p=q.find(x=>x.id===id);if(!p)return;
 p.status="Missed";
 p.missedAt=p.missedAt||new Date().toISOString();
 p.exitedAt=new Date().toISOString();
 p.rescheduleMessage="You missed your appointment. Please reschedule a new appointment if you still need care.";
 saveQueue(q);
 const current=JSON.parse(localStorage.getItem("careflowCurrent")||"null");
 if(current && current.id===id) localStorage.setItem("careflowCurrent",JSON.stringify(p));
 loadReceptionistQueue();
}

function requeuePatient(id){
 let q=getQueue(),p=q.find(x=>x.id===id);if(!p)return;
 p.status=p.emergency?"Emergency — Pending Triage":"Waiting";
 p.requeuedAt=new Date().toISOString();
 // Put the patient at the end of the active queue.
 q=q.filter(x=>x.id!==id);
 q.push(p);
 saveQueue(q);
 const current=JSON.parse(localStorage.getItem("careflowCurrent")||"null");
 if(current && current.id===id) localStorage.setItem("careflowCurrent",JSON.stringify(p));
 loadReceptionistQueue();
}

function isReceptionAuthenticated(){
 const id=sessionStorage.getItem("careflowReceptionAuth");
 return !!id && hospitals.some(h=>h.id===id);
}

function showReceptionLogin(){
 const login=document.getElementById("receptionLogin"),dash=document.getElementById("receptionDashboard");
 if(login) login.classList.remove("hidden");
 if(dash) dash.classList.add("hidden");
 const sel=document.getElementById("loginHospital");
 if(sel) sel.innerHTML='<option value="">Choose hospital</option>'+hospitals.map(h=>`<option value="${h.id}">${h.name}</option>`).join("");
}

function showReceptionDashboard(){
 const login=document.getElementById("receptionLogin"),dash=document.getElementById("receptionDashboard");
 if(login) login.classList.add("hidden");
 if(dash) dash.classList.remove("hidden");
 const auth=sessionStorage.getItem("careflowReceptionAuth");
 const hospitalSel=document.getElementById("receptionHospital");
 const doctorSel=document.getElementById("receptionDoctor");
 if(hospitalSel){
  hospitalSel.innerHTML='<option value="">Choose hospital</option>'+hospitals.map(h=>`<option value="${h.id}">${h.name}</option>`).join("");
  if(auth) hospitalSel.value=auth;
  hospitalSel.disabled=true;
  localStorage.setItem("careflowReceptionHospital",auth||"");
  hospitalSel.onchange=()=>loadReceptionistQueue();
 }
 if(doctorSel){ doctorSel.innerHTML='<option value="">All doctors</option>'+(hospitals.find(h=>h.id===auth)?.doctors||[]).map(d=>`<option value="${d[0]}">${d[0]} — ${d[1]}</option>`).join(""); doctorSel.onchange=()=>loadReceptionistQueue(); }
 loadReceptionistQueue();
 const clock=document.getElementById("clock");
 const updateClock=()=>clock.textContent=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
 updateClock();setInterval(updateClock,1000);
}

function initReception(){
 const body=document.getElementById("receptionQueue");
 if(!body)return;
 const form=document.getElementById("receptionLoginForm");
 if(form){
  const sel=document.getElementById("loginHospital");
  sel.innerHTML='<option value="">Choose hospital</option>'+hospitals.map(h=>`<option value="${h.id}">${h.name}</option>`).join("");
  form.addEventListener("submit",e=>{
   e.preventDefault();
   const hospitalId=sel.value, password=document.getElementById("loginPassword").value;
   const error=document.getElementById("loginError");
   if(receptionistPasswords[hospitalId] && receptionistPasswords[hospitalId]===password){
    sessionStorage.setItem("careflowReceptionAuth",hospitalId);
    document.getElementById("loginPassword").value="";
    error.classList.add("hidden");
    showReceptionDashboard();
   }else{
    error.classList.remove("hidden");
   }
  });
 }
 if(isReceptionAuthenticated()) showReceptionDashboard();
 else showReceptionLogin();
}

function logoutReceptionist(){
 sessionStorage.removeItem("careflowReceptionAuth");
 showReceptionLogin();
}

function loadReceptionistQueue(){
 if(!isReceptionAuthenticated()){showReceptionLogin();return;}
 const body=document.getElementById("receptionQueue");if(!body)return;
 const hospitalSel=document.getElementById("receptionHospital");
 const doctorSel=document.getElementById("receptionDoctor");
 const hospitalId=sessionStorage.getItem("careflowReceptionAuth");
 if(hospitalSel && hospitalSel.value!==hospitalId) hospitalSel.value=hospitalId;
 const all=getQueue();
 // Only active patients are shown in the live receptionist queue.
 // Cancelled and completed consultations remain in local history but are hidden here.
 let q=hospitalId?all.filter(p=>p.hospitalId===hospitalId&&isActiveStatus(p.status)&&p.status!=="Missed"):[];
 const selectedDoctor=doctorSel?.value||"";
 if(selectedDoctor) q=q.filter(p=>p.doctor===selectedDoctor);
 // Emergency patients always stay at the top. Verified emergencies are first,
 // followed by pending emergency cases, then normal patients in their queue order.
 q.sort((a,b)=>{
  const rank=p=>p.emergency?(p.status==="Emergency — Verified for Doctor"?0:1):2;
  const rankDiff=rank(a)-rank(b);
  if(rankDiff!==0)return rankDiff;
  if(a.emergency&&b.emergency) return new Date(a.createdAt||0)-new Date(b.createdAt||0);
  const dateDiff=(a.appointmentDate||"9999-12-31").localeCompare(b.appointmentDate||"9999-12-31");
  if(dateDiff!==0)return dateDiff;
  const timeDiff=timeToMinutes(a.slot)-timeToMinutes(b.slot);
  if(timeDiff!==0)return timeDiff;
  return (a.queuePosition||0)-(b.queuePosition||0) || (new Date(a.createdAt||0)-new Date(b.createdAt||0));
 });
 body.innerHTML="";

 const noQueue=document.getElementById("noQueue");
 if(!hospitalId){
  noQueue.innerHTML="Please select your hospital above to view only that hospital's patients.";
  noQueue.classList.remove("hidden");
 }else{
  noQueue.innerHTML="No patients are currently in the active queue for this hospital.";
  noQueue.classList.toggle("hidden",q.length>0);
 }

 q.forEach(p=>{
  const type=p.emergency?`<span class="tag emergency">Emergency</span>`:`<span class="tag normal">Normal</span>`;
  let statusClass=p.status==="Called"?"called":((p.emergency?true:false)?"emergency-now":((p.status==="Missed"||p.status==="Missed — Decision Pending")?"missed":""));
  const status=`<span class="tag ${statusClass}">${p.status}</span>`;
  let actions="";
  if(p.emergency && p.status==="Emergency — Pending Triage") {
   actions=`<button class="action-btn call" onclick="verifyEmergency(${p.id})">✓ Triage</button>`;
  } else if(p.emergency && p.status==="Emergency — Emergency Department") {
   actions=`<span class="tag emergency-now">Emergency department</span>`;
  } else if(p.emergency && p.status==="Emergency — Verified for Doctor") {
   actions=`<button class="action-btn call" onclick="markConsulted(${p.id})">✓ Consulted</button><button class="action-btn" onclick="markMissed(${p.id})">Missed</button>`;
  } else if(p.status==="Waiting" || p.status==="Not Emergency") {
   actions=`<button class="action-btn call" onclick="callPatient(${p.id})">Call next</button>`;
  } else if(p.status==="Called") {
   actions=`<div class="action-stack"><button class="action-btn call" onclick="chooseCallOutcome('received',${p.id})">✓ Received consultation</button><button class="action-btn" onclick="chooseCallOutcome('missed',${p.id})">Missed</button></div>`;
  } else if(p.status==="Consultation Received") {
   actions=`<button class="action-btn call" onclick="markConsulted(${p.id})">✓ Consulted</button>`;
  } else if(p.status==="Missed — Decision Pending") {
   actions=`<div class="action-stack"><button class="action-btn exit-btn" onclick="exitPatient(${p.id})">Exit queue</button><button class="action-btn requeue-btn" onclick="requeuePatient(${p.id})">Re-queue at end</button></div>`;
  }

  body.innerHTML+=`<tr><td><b>${escapeHTML(p.token)}</b></td><td>${escapeHTML(p.name)}<br><small>${escapeHTML(p.phone)}</small></td><td><b>${escapeHTML(p.age ?? "—")}</b> years<br><small>${escapeHTML(p.gender || "—")}</small></td><td>${escapeHTML(p.hospital)}<br><small>${escapeHTML(p.doctor)}</small></td><td><b>${p.emergency?"Emergency":formatAppointmentDate(p.appointmentDate)}</b></td><td><b>${p.emergency?"Immediate":escapeHTML(p.slot||"—")}</b></td><td>${type}</td><td>${status}</td><td>${actions}</td></tr>`;
 });

 const active=q.filter(p=>!['Completed','Cancelled','Exited','Missed'].includes(p.status));
 document.getElementById("metricTotal").textContent=active.length;
 document.getElementById("metricEmergency").textContent=active.filter(p=>p.emergency).length;
 document.getElementById("metricVerified").textContent=q.filter(p=>p.emergency && p.status==="Emergency — Verified for Doctor").length;
 document.getElementById("metricCalled").textContent=q.filter(p=>p.status==="Called").length;
}

// Keep open patient/receptionist tabs synchronized when queue data changes.
window.addEventListener("storage", (event)=>{
 if(event.key==="careflowQueue"){
   loadReceptionistQueue();
   const current=JSON.parse(localStorage.getItem("careflowCurrent")||"null");
   if(typeof refreshQueueView==="function" && current) refreshQueueView(current);
 }
});

function initDoctor(){
 const body=document.getElementById("doctorQueue"); if(!body)return;
 const auth=sessionStorage.getItem("careflowReceptionAuth");
 const login=document.getElementById("doctorLogin"),dash=document.getElementById("doctorDashboard"),sel=document.getElementById("doctorConsoleSelect"),dateInput=document.getElementById("doctorConsoleDate");
 if(!auth || !hospitals.some(h=>h.id===auth)){login.classList.remove("hidden");dash.classList.add("hidden");return;}
 login.classList.add("hidden");dash.classList.remove("hidden");
 const hospital=hospitals.find(h=>h.id===auth);
 sel.innerHTML=hospital.doctors.map((d,i)=>`<option value="${i}">${d[0]} — ${d[1]}</option>`).join("");
 dateInput.value=todayISO();
 dateInput.min=todayISO();
 sel.onchange=loadDoctorQueue;
 dateInput.onchange=loadDoctorQueue;
 const clock=document.getElementById("doctorClock");
 const tick=()=>clock.textContent=new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}); tick(); setInterval(tick,1000);
 loadDoctorQueue();
}
function loadDoctorQueue(){
 const body=document.getElementById("doctorQueue"); if(!body)return;
 const auth=sessionStorage.getItem("careflowReceptionAuth"); const hospital=hospitals.find(h=>h.id===auth); if(!hospital)return;
 const sel=document.getElementById("doctorConsoleSelect"); const dateInput=document.getElementById("doctorConsoleDate");
 const d=hospital.doctors[Number(sel.value)||0];
 const selectedDate=dateInput.value||todayISO();
 document.getElementById("doctorTitle").textContent=d?d[0]:"Doctor console";
 const heading=document.getElementById("doctorQueueHeading");
 if(heading) heading.textContent=`Doctor queue — ${formatAppointmentDate(selectedDate)}`;
 const q=getQueue().filter(p=>{
  if(p.hospitalId!==auth || p.doctor!==d?.[0] || !isActiveStatus(p.status)) return false;
  // Normal appointments are shown only for the selected appointment date.
  if(!p.emergency) return p.appointmentDate===selectedDate;
  // Emergency cases have no appointment date/time. They are real-time cases and
  // therefore appear only when the doctor is viewing today's queue.
  return selectedDate===todayISO() && p.status==="Emergency — Verified for Doctor";
 }).sort((a,b)=>{
  const emergencyRank=a.emergency?0:1, emergencyRankB=b.emergency?0:1;
  return emergencyRank-emergencyRankB || timeToMinutes(a.slot)-timeToMinutes(b.slot) || (a.queuePosition||0)-(b.queuePosition||0);
 });
 body.innerHTML="";
 document.getElementById("doctorWaiting").textContent=q.filter(p=>p.status==="Waiting").length;
 document.getElementById("doctorCalled").textContent=q.filter(p=>p.status==="Called").length;
 document.getElementById("doctorReceived").textContent=q.filter(p=>p.status==="Consultation Received").length;
 document.getElementById("doctorNext").textContent=(q.find(p=>p.status==="Waiting")||{}).token||"—";
 const no=document.getElementById("doctorNoQueue"); no.classList.toggle("hidden",q.length>0);
 q.forEach(p=>{
  let action="";
  if(p.status==="Waiting") action=`<button class="action-btn call" onclick="callPatient(${p.id})">Call next</button>`;
  else if(p.status==="Called") action=`<button class="action-btn call" onclick="chooseCallOutcome('received',${p.id})">✓ Patient arrived</button><button class="action-btn" onclick="chooseCallOutcome('missed',${p.id})">Missed</button>`;
  else if(p.status==="Consultation Received") action=`<button class="action-btn call" onclick="markConsulted(${p.id})">✓ Consultation complete</button>`;
  body.innerHTML+=`<tr><td><b>${escapeHTML(p.token)}</b></td><td>${escapeHTML(p.name)}<br><small>${escapeHTML(p.phone||"")}</small></td><td>${escapeHTML(p.age??"—")} years<br><small>${escapeHTML(p.gender||"—")}</small></td><td>${p.emergency?"Immediate":escapeHTML(formatAppointmentDate(p.appointmentDate))}</td><td>${p.emergency?"Immediate":escapeHTML(p.slot||"—")}</td><td>${p.emergency?"Emergency":"Normal"}</td><td><span class="tag ${p.status==='Called'?'called':''}">${escapeHTML(p.status)}</span></td><td>${action}</td></tr>`;
 });
}

initHome();initBooking();initQueue();initReception();initDoctor();
