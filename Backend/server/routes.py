from flask import render_template, jsonify, request, make_response
from server import app
from server import db
from server.models import Patient, Staff, BlacklistToken
import random


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/ehr/<string:patient_ehr>', methods=['GET'])
def get_patient_ehr(patient_ehr):
    patient = Patient.query.filter_by(ehrId=patient_ehr).first()
    return jsonify(patient.serialize())


@app.route('/api/pid/<string:patient_pid>', methods=['GET'])
def get_patient_pid(patient_pid):
    patient = Patient.query.filter_by(Personnummer=patient_pid).first()
    return jsonify(patient.serialize())


# Expected data format: { "pulse": 80, "oxygen_saturation": 40, "blood_pressure_systolic": 127,
# "blood_pressure_diastolic": 67, "breathing_frequency": 17, "alertness": "awake", "body_temperature": 37.3 }
@app.route('/api/update/<string:patient_ehr>', methods=['PUT'])
def update_patient(patient_ehr):
    patient = Patient.query.filter_by(ehrId=patient_ehr).first()

    patient.pulse = request.json['pulse']
    patient.oxSaturation = request.json['oxygen_saturation']
    patient.sysBloodPressure = request.json['blood_pressure_systolic']
    patient.diaBloodPressure = request.json['blood_pressure_diastolic']
    patient.breathingFreq = request.json['breathing_frequency']
    patient.alertness = request.json['alertness']
    patient.bodyTemp = request.json['body_temperature']

    db.session.commit()

    return "updated patient"


# Expected data format: { "username": "useruser", "password": "passpass" }, checks validity of login data and creates
# an access token for the user
@app.route('/api/login', methods=['GET','POST'])
def get_staff_login():
    data = request.get_json()
    try:
        staff = Staff.query.filter_by(username=data['username']).first()
        if staff and data['password'] == staff.password:
            auth_token = staff.encode_token(staff.id)
            if auth_token:
                response = {
                    'status' : 'success',
                    'message' : 'Logged in',
                    'auth_token' : auth_token.decode()
                }
                return make_response(jsonify(response)), 200
        else:
            response = {
                'satus': 'fail',
                'message': 'invalid password or username'
            }
            return make_response(jsonify(response)), 401
    except Exception as e:
        print(e)
        response = {
            'status' : 'fail',
            'message' : 'Try again'
        }
        return make_response(jsonify(response)), 500


# checks that the request was made with a valid access token in the 'Authorization' header
@app.route('/api/authenticate', methods=['GET','POST'])
def authenticate():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[0]
    else:
        auth_token = ""
    if auth_token:
        resp = Staff.decode_token(auth_token)
        if isinstance(resp, int):
            staff = Staff.query.filter_by(id=resp).first()
            response = {
                'status': 'success',
                'data' : {'user':staff.username}
            }
            return make_response(jsonify(response)), 200
        else:
            response = {
                'status': 'fail',
                'message': resp
            }
            return make_response(jsonify(response)), 401
    else:
        response = {
            'status' : 'fail',
            'message': 'provide an auth token in Authorization header'
        }
        return make_response(jsonify(response)), 401

# Invalidates the token in 'Authorization' header
@app.route('/api/logout', methods=['POST'])
def logout():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[0]
    else:
        auth_token = ""
    if auth_token:
        resp = Staff.decode_token(auth_token)
        if isinstance(resp, int):
            blacklist_token = BlacklistToken(auth_token)
            try:
                db.session.add(blacklist_token)
                db.session.commit()
                response = {
                    'status': 'success',
                    'message': 'Logged out'
                }
                return make_response(jsonify(response)), 200
            except Exception as e:
                response = {
                    'status': 'fail',
                    'message': e
                }
                return make_response(jsonify(response)), 200
        else:
            response = {
                'status': 'fail',
                'message': resp
            }
            return make_response(jsonify(response)), 401
    else:
        response = {
            'status': 'fail',
            'message': 'Invalid token'
        }
        return make_response(jsonify(response)), 403

#expected data format {"PatientPID": "XXXXXXXX-XXXX"} returns data as a json object. Do not forget to include
#Authorization header with the logged in users token!
@app.route('/api/philips_mock', methods=['POST'])
def philips():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[0]
    else:
        auth_token = ""
    if auth_token:
        resp = Staff.decode_token(auth_token)
        if isinstance(resp, int):
            patient_pid = request.get_json()['PatientPID']
            patient = Patient.query.filter_by(Personnummer=patient_pid)
            if patient:
                systolic_bp = 130 + random.randrange(-40, 41)
                diastolic_bp = systolic_bp - 40 + random.randrange(-5, 5)
                response = {
                    'status': 'success',
                    'data': {'systolic_bp': systolic_bp,
                             'diastolic_bp': diastolic_bp,
                             'breathing_rate': 12 + random.randrange(-5, 5),
                             'oxygen_saturation': 100 - random.randint(0, 11)
                             }
                }
                return make_response(jsonify(response)), 200
            else:
                response = {
                    'status':'fail',
                    'message': 'add a PatientPID data entrance as json in body'
                }
                return make_response(jsonify(response))
        else:
            response = {
                'status': 'fail',
                'message': resp
            }
            return make_response(jsonify(response)), 401
    else:
        response = {
            'status': 'fail',
            'message': 'provide an auth token in Authorization header'
        }
        return make_response(jsonify(response)), 401


@app.route('/patient_list', methods=['GET'])
def patient_list():
    patients = Patient.query.all()
    patients = [p.short_form() for p in patients]
    return jsonify(patients)


@app.route('/staff_list', methods=['GET'])
def staff_list():
    staff = Staff.query.all()
    staff = [s.short_form() for s in staff]
    return jsonify(staff)
