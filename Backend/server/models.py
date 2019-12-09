from server import db, app
import datetime
import jwt


class Patient(db.Model):
    id = db.Column(db.String(20), primary_key=True)
    firstNames = db.Column(db.String(40))
    lastNames = db.Column(db.String(40))
    gender = db.Column(db.String(8))
    dateOfBirth = db.Column(db.String(20))

    ehrId = db.Column(db.String(20))
    Personnummer = db.Column(db.String(13))

    pulse = db.Column(db.Integer)
    oxSaturation = db.Column(db.Integer)
    sysBloodPressure = db.Column(db.Integer)
    diaBloodPressure = db.Column(db.Integer)

    breathingFreq = db.Column(db.Integer)
    alertness = db.Column(db.String(10))
    bodyTemp = db.Column(db.Float)

    def serialize(self):
        return {
            'demographics': {
                'id': self.id,
                'firstNames': self.firstNames,
                'lastNames': self.lastNames,
                'gender': self.gender,
                'dateOfBirth': self.dateOfBirth,
                'additionalInfo': {
                    'ehrId': self.ehrId,
                    'Personnummer': self.Personnummer
                }
            },
            'vital_signs': {
                'body_temperature': [
                    {
                        'any_event': [
                            {
                                'temperature': [
                                    {
                                        '|magnitude': self.bodyTemp,
                                        '|unit': '°C'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'blood_pressure': [
                    {
                        'any_event': [
                            {
                                'systolic': [
                                    {
                                        '|unit': 'mm[Hg]',
                                        '|magnitude': self.sysBloodPressure
                                    }
                                ],
                                'diastolic': [
                                    {
                                        '|unit': 'mm[Hg]',
                                        '|magnitude': self.diaBloodPressure
                                    }
                                ],
                                'position': [
                                    {
                                        '|code': 'at1001',
                                        '|value': 'Sitting'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            'pulse': self.pulse,
            'oxygen_saturation': self.oxSaturation,
            'breathing_frequency': self.breathingFreq,
            'alertness': self.alertness
        }

    def short_form(self):
        return {
            'firstNames': self.firstNames,
            'lastNames': self.lastNames,
            'pid': self.Personnummer,
            'ehrId': self.ehrId
        }


class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20), unique=True)
    password = db.Column(db.String(20))
    firstNames = db.Column(db.String(40))
    lastNames = db.Column(db.String(40))
    position = db.Column(db.String(20))

    def serialize(self):
        return {
            'firstNames': self.firstNames,
            'lastNames': self.lastNames,
            'position': self.position
        }

    def short_form(self):
        return {
            'username': self.username,
            'password': self.password
        }

    def encode_token(self, user_id):
        payload = {
            'exp' : datetime.datetime.utcnow() + datetime.timedelta(days=0,seconds=60, hours=1),
            'iat' : datetime.datetime.utcnow(),
            'sub' : user_id
        }
        return jwt.encode(
            payload,
            app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )

    @staticmethod
    def decode_token(token):
        try:
            payload = jwt.decode(token, app.config.get('SECRET_KEY'))
            if BlacklistToken.check_blacklist(token):
                return 'Blacklisted token please log in again.'
            else:
                return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Token expired please log in again'
        except jwt.InvalidTokenError:
            return 'Invalid token'


class BlacklistToken(db.Model):
    id = db.Column(db.Integer,primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    blacklisted_on = db.Column(db.DateTime, nullable=False)

    def __init__(self,token):
        self.token = token
        self.blacklisted_on = datetime.datetime.now()

    @staticmethod
    def check_blacklist(token):
        res = BlacklistToken.query.filter_by(token=str(token)).first()
        if res:
            return True
        else:
            return False

