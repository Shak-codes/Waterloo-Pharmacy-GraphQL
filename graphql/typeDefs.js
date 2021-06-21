const { gql } = require('apollo-server');

module.exports = gql`

  type Query {
    patient(id: ID!): Patient
    doctor(id: ID!): Doctor
    allPatients: All
    allDoctors: All
  }

  type All {
    list: [String]
  }

  type Patient {
    id: ID!
    name: String!
    doctors: [Doctor]
  }

  type Doctor {
    id: ID
    name: String
    patients: [Patient]
  }

  type Mutation {
    createAppointment(input: CreateAppointmentRequest!): CreateAppointmentResponse
    addDoctor(input: AddDoctorRequest!): AddDoctorResponse
  }

  input CreateAppointmentRequest {
    patient_id: ID!
    doctor_id: ID!
    date: String
  }

  input AddDoctorRequest {
    name: String!
  }

  type CreateAppointmentResponse {
    appointment: Appointment
  }

  type AddDoctorResponse {
    doctor: Doctor
  }

  type Appointment {
    id: ID
    patient_id: String
    doctor_id: String
    date: String
  }

`;

