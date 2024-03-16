var controller = require('./../controller/controller')
var express = require('express');
var router = express.Router();

router.post('/addUsers', function(req, res, next) {
    controller.addUsers(req.body).then(result => {
        if (result === 'alreadyExisted') {
            return res.status(400).send({
                message: ' This Email Already Existed'
            })
        } else {
            return res.status(200).send({
                status: 'Success',
                messgae: 'successfully User Added',
                error: null,
                token: result.token

            })
        }

    }, err => {
        return res.status(500).send({
            status: "failed",
            error: "interval server error",
            message: err,
        })
    })
});



router.post('/login', function(req, res, next) {
    controller.login(req.body).then(result => {
        if (result === 'IncorrectPass') {
            return res.status(403).send({
                status: 'failed',
                message: 'Please Enter Correct Password'
            })
        } else if (result === 'UserNotFound') {
            return res.status(404).send({
                message: 'No Urer found with this Email. Please Enter Registered Email:'
            })
        } else {
            return res.status(200).send({
                status: 'Success',
                message: 'Successfully Logged In',
                token: result.token,
                err: null

            })
        }
    }, err => {
        return res.status(500).send({
            success: false,
            error: 'internal server error',
            msg: err
        })
    })

});

router.get('/allUsers', function(req, res, next) {
    controller.proctected(req).then(() => {
        controller.getUsers(req.body).then(result => {
            return res.status(200).send({
                status: 'succes',
                err: null,
                allUsers: result
            });
        }).catch(err => {
            return res.status(500).send({
                status: 'failed',
                message: 'No User Found, Internal server Error!!'
            })
        })

    }).catch(error => {
        return res.status(401).send({
            status: 'failed',
            message: 'Unauthorized:' + error,
        })
    })
});




// router.get('/allUsers', function(req, res, next) {
//     controller.getUsers(req.body).then(result => {
//         return res.status(200).send({
//             status: 'succes',
//             err: null,
//             allUsers: result
//         });

//     }).catch(error => {
//         return res.status(500).send({
//             status: 'failed',
//             message: error
//         })
//     })
// });





router.patch('/changePass/:id', function(req, res, next) {
    controller.changePassword(req.body, req.params.id).then(result => {
        if (result === 'CurrentPasswordnotMatched') {
            return res.status(403).send({
                status: 'failed',
                message: 'current Password Does Not Matched in Database'
            })
        } else if (result === 'UserNotFound') {
            return res.status(404).send({
                message: 'No user found with this Id'
            })
        } else {
            return res.status(200).send({
                status: 'Success',
                message: 'Password Change Successfully',
                err: null

            })
        }
    }, err => {
        return res.status(500).send({
            success: false,
            error: 'internal server error',
            msg: err
        })
    })

});



router.delete('/delUser/:id', function(req, res, next) {
    controller.deleteUser(req.body, req.params.id).then(result => {
        return res.status(200).send({
            status: 'succes',
            err: null,
            message: 'Succesfully User Deleted'
        });

    }).catch(error => {
        return res.status(404).send({
            status: 'failed',
            message: 'No user Find with This ID:'
        })
    })
});
module.exports = router;