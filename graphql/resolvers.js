const fetch = require('node-fetch');

const API_URL =
'http://localhost:4000/api/v1';


const Query = {
  async patient(parent, args, context, info) {
    const { id } = args;
    const response = await fetch(`${API_URL}/patients/${id}`);
    const body = await response.json();
    return body;
  },

  doctor: async (_, { id }) =>
    fetch(`${API_URL}/doctor/${id}`).then((res) => res.json()),

  allPatients: async (parent, args, context, info) => {

    const response = await fetch(`${API_URL}/patients`);
    const body = await response.json();

    const length = body.length;
    let names = [];

    for (let i = 0; i < length; i++) {
      names.push(body[i].name);
    }

    return {
      list: names,
    };
  },

  allDoctors: async (parent, args, context, info) => {

    const response = await fetch(`${API_URL}/doctors`);
    const body = await response.json();

    const length = body.length;
    let names = [];

    for (let i = 0; i < length; i++) {
      names.push(body[i].name);
    }

    return {
      list: names,
    };
  },
};

  /*async allPatient(parent, args, context, info) {
    const response = await fetch(`${API_URL}/patients`);
    const body = await response.json();
    return body;
  },*/


const Doctor = {
  patients: async ({ id }) => {
    const visits = await fetch(`${API_URL}/visit/doctor/${id}`).then((res) =>
      res.json()
    );

    return Promise.all(
      visits.map(({ patient_id }) =>
        fetch(`${API_URL}/patients/${patient_id}`).then((res) => res.json())
      )
    );
  },
};

const Patient = {
  async doctors(parent, args, context, info) {
    const id = { parent };
    const url = `${API_URL}/visit/patient/${id}`;
    const visits = await fetch(url).then((res) => res.json());
    // this is what we are replacing with DataLoader
    /*
    const arrayOfDoctorPromises = visits.map((v) =>
    fetch(`${API_URL}/doctor/${v.doctor_id}`).then((res) => res.json())
    );
    */
    const { loaders } = context;
    const arrayOfDoctorPromises = visits.map((v) =>
    loaders.doctorLoader.load(v.doctor_id)
    );
    const doctors = await Promise.all(arrayOfDoctorPromises);
    return doctors;
  },
};


let mockAppointmentsDb = [];
let mockDoctorsDb = [];

const Mutation = {
  createAppointment: (parent, args, context, info) => {
  const { input } = args;
  const { patient_id, doctor_id, date } = input;

  // Create and save the new Appointment model to our database
  const appointmentRecord = {
    id: mockAppointmentsDb.length,
    patient_id,
    doctor_id,
    date,
  };

  mockAppointmentsDb.push(appointmentRecord);
  
  // Return the new appointment
  return {
    appointment: appointmentRecord,
    };
  },
  addDoctor: (parent, args, context, info) => {
    const { input } = args;
    const { name } = input;

    const doctorData = {
      id: mockDoctorsDb.length,
      name,
    };

    mockDoctorsDb.push(doctorData);

    return {
      doctor: doctorData,
    };
  },
};







module.exports = { Query, Patient, Doctor, Mutation };
