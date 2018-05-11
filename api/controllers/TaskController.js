/**
 * TaskController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getTasks: async (req, res) => {
    Task.find((err, tasks) => {
      if (err) {
        return res.serverError({
          success: false,
          message: 'Server Error'
        });
      }
      return res.ok({
        success: true,
        tasks: tasks
      });
    });
  },

  createTask: async (req, res) => {
    let taskContent = req.body.text;
    let newTask = {
      text: taskContent
    };
    if (!taskContent) {
      return res.badRequest({
        success: false,
        message: 'Missing content of task'
      });
    } else {
      Task.create(newTask).exec((err) => {
        if (err) {
          return res.serverError({
            success: false,
            message: 'Server Error'
          });
        }
        return res.ok({
          success: true
        });
      });
    }
  },

  updateTask: async (req, res) => {
    let id = req.params.id;
    let updatedTaskContent = req.body.text;
    let updatedTaskStatus = req.body.status;
    let updatedTask = {
      text: updatedTaskContent,
      status: updatedTaskStatus
    };
    if (!updatedTaskContent || updatedTaskStatus === null) {
      return res.badRequest({
        success: false,
        message: 'Missing content of task'
      });
    } else {
      Task.findOne({
        id: id
      }).exec((err, task) => {
        if (err) {
          return res.serverError({
            success: false,
            message: 'Server Error'
          });
        }
        if (typeof task === 'undefined') {
          // res.notFound();
          res.status(404).json({
            success: false,
            message: 'Task not found'
          });
        } else {
          Task.update({
            _id: id
          }, updatedTask).exec((err) => {
            if (err) {
              return res.serverError({
                success: false,
                message: 'Server Error'
              });
            }
            return res.ok({
              success: true,
              message: 'Task updated'
            });
          });
        }
      });
    }

  },

  deleteTask: async (req, res) => {
    let id = req.params.id;
    Task.findOne({
      id: id
    }).exec((err, task) => {
      if (err) {
        return res.serverError({
          success: false,
          message: 'Server Error'
        });
      }else if (typeof task === 'undefined') {
        res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }else {
        Task.destroy({
          id: id
        }).exec((err) => {
          if (err) {
            return res.serverError({
              success: false,
              message: 'Server Error'
            });
          }else {
            return res.ok({
              success: true
            });
          }
        });
      }
    });
  }
};
