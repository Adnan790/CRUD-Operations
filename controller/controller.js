let controller = {};
var mongoose = require('mongoose');
var promise = require('promise');
var User = mongoose.model('userData');
var bcrypt = require('./../helper/bcrypt');
var jwt = require('jsonwebtoken');
const util = require('util');


const SECERT_KEY = 'shdghagdgdgahsgdhgsad';

controller.addUsers = (payload) => {
    return new Promise(async(resolve, reject) => {
        try {
            let finduser = await User.findOne({ Email: payload.Email })
            if (finduser) {
                resolve('alreadyExisted')
            } else {
                payload.Password = await bcrypt.getHash(payload.Password);
                //console.log('p. Pass', payload.Password);
                User.create(payload).then(data => {
                    const token = jwt.sign({ id: data._id }, SECERT_KEY, {
                        expiresIn: '1h',
                    })
                    resolve({ user: data, token: token });
                }).catch(err => {
                    reject(err)
                })
            }


        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}



controller.login = (payload) => {
    try {
        return new Promise(async(resolve, reject) => {
            let userfind = await User.findOne({ Email: payload.Email });
            if (userfind) {
                bcrypt.compare(payload.Password, userfind.Password).then(matched => {
                    if (matched) {
                        const token = jwt.sign({ id: userfind._id }, SECERT_KEY, {
                            expiresIn: '1h',
                        })
                        resolve({ userfind, token })
                    } else {
                        resolve('IncorrectPass')
                    }
                }).catch(err => {
                    reject(err);
                })

            } else {
                resolve('UserNotFound')
            }
        })

    } catch (error) {
        reject(error);
    }

}

controller.getUsers = () => {

    try {
        return new Promise(async(resolve, reject) => {

            await User.find().then(user => {
                resolve(user)
            }).catch(err => {
                reject(err)
            })

        })
    } catch (error) {
        reject(error)
    }

}


controller.proctected = (req) => {
    return new Promise((resolve, reject) => {
        try {

            const testToken = req.headers.authorization;
            let token;
            if (testToken && testToken.startsWith('bearer')) {
                token = testToken.split(' ')[1]
            }

            if (!token) {
                reject('Not LoggedIN', token)
            }
            try {

                const decodeToken = util.promisify(jwt.verify)(token, SECERT_KEY);
                console.log(decodeToken);
                resolve(decodeToken);
            } catch (error) {
                reject(' Jwt Varification failed:' + error.message)
            }
        } catch (error) {
            reject(error)
        }

    })


}

//UPDATE USER PASSWORD

controller.changePassword = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await User.findById({ _id: id });
            console.log('User:', user);
            if (user) {
                const currentPasswordMatch = await bcrypt.compare(payload.CurrentPassword, user.Password);
                console.log('Current Password Match:', currentPasswordMatch);
                if (currentPasswordMatch) {
                    const hashedNewPassword = await bcrypt.getHash(payload.NewPassword);
                    console.log('New Password Hash:', hashedNewPassword);
                    await User.updateOne({ _id: id }, { Password: hashedNewPassword });
                    return resolve(user);
                } else {
                    resolve('CurrentPasswordnotMatched')
                }

            } else {
                resolve('UserNotFound')
            }

        } catch (error) {
            reject(error)
        }


    })

}


controller.deleteUser = (id) => {
    return new Promise(async(resolve, reject) => {
        try {
            const user = User.findByIdAndDelete({ _id: id });
            if (user) {
                //console.log('User Find in DB:', user);
                resolve(user)
            } else {
                reject(user)
            }
        } catch (error) {
            reject(error)
        }


    })
}



module.exports = controller;