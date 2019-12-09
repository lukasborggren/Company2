from server import db
from server.models import Patient, Staff


def add_patient(prId, fName, lName, gender, birth, ehrId, pid, pulse, oxSat, sysBp, diaBp, brFreq, alert, temp):
    db.session.add(Patient(id=prId,
                           firstNames=fName,
                           lastNames=lName,
                           gender=gender,
                           dateOfBirth=birth,
                           ehrId=ehrId,
                           Personnummer=pid,
                           pulse=pulse,
                           oxSaturation=oxSat,
                           sysBloodPressure=sysBp,
                           diaBloodPressure=diaBp,
                           breathingFreq=brFreq,
                           alertness=alert,
                           bodyTemp=temp))


def add_staff(username, password, fName, lName, position):
    db.session.add(Staff(username=username, password=password, firstNames=fName, lastNames=lName, position=position))


db.reflect()
db.drop_all()
db.create_all()

add_patient('123a', 'John', 'Doe', 'male', '1992-10-30', '8521e620-d38e-4fd6-9071-f785c2ece9b3',
            '19791111-0017', 80, 40, 127, 67, 17, 'awake', 37.3)
add_patient('123b', 'Jane', 'Doe', 'female', '1987-01-08', '8521e620-d38e-4fd6-9071-kj45ng60n6v4',
            '19870108-0766', 72, 60, 90, 60, 14, 'awake', 36.9)
add_patient('123c', 'Nomen', 'Nescio', 'male', '1960-07-21', '8521e620-d38e-4fd6-9071-oc74on984kn3',
            '19600721-8418', 82, 50, 102, 65, 18, 'critical', 38.2)

add_staff('useruser', 'passpass', 'Lorem', 'Ipsum', 'Nurse')
add_staff('myusername', 'mypassword', 'Person', 'Personsson', 'Doctor')
add_staff('junguser', 'jungpass123', 'Carl', 'Jung', 'Doctor')


db.session.commit()
