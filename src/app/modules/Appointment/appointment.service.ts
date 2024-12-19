import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { v4 as uuidv4 } from "uuid";

const createAppointment = async (user: IAuthUser, payload: any) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingId: string = uuidv4();
  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await prisma.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduledId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        scheduled: true,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    //PH_HealthCare-datetime
    const today = new Date();
    const transactionId = `PH_HealthCare-${today.getFullYear()}-today-${today.getMonth()}-${today.getHours()}-${today.getMinutes()}`;

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId,
      },
    });

    return appointmentData;
  });
  return result;
};

export const AppointmentServices = { createAppointment };
