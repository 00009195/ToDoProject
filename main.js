/** ======================================================
 *             Project Libraries
========================================================*/
const express = require('express')
const main = express()
const fs = require('fs')
const PORT = 8000 // Port number the project will run in this port
const JsDataBase = './data/ProjectTasks.json' //Direction for ProjectTasks


/** ======================================================
 *                 Asset Files
========================================================*/
main.set('view engine', 'pug')
main.use('/static', express.static('public'))
main.use(express.urlencoded({ extended: false }))


/** ======================================================
 *                Logic Part
========================================================*/
main.get('/', (req, res) => {
    fs.readFile(JsDataBase, (err, data) => {
        if (err) throw err

        const ProjectTasks = JSON.parse(data)

        res.render('home', { ProjectTasks: ProjectTasks })
    })
})

main.post('/add', (req, res) => {
    const formData = req.body

    if (formData.ProjectTask.trim() == '') {
        fs.readFile(JsDataBase, (err, data) => {
            if (err) throw err

            const ProjectTasks = JSON.parse(data)

            res.render('home', { mistake: true, ProjectTasks: ProjectTasks })
        })
    } else {
        fs.readFile(JsDataBase, (err, data) => {
            if (err) throw err

            const ProjectTasks = JSON.parse(data)

            const ProjectTask = {
                id: id(),
                description: formData.ProjectTask,
                adding: false
            }

            ProjectTasks.push(ProjectTask)

            fs.writeFile(JsDataBase, JSON.stringify(ProjectTasks), (err) => {
                if (err) throw err

                fs.readFile(JsDataBase, (err, data) => {
                    if (err) throw err

                    const ProjectTasks = JSON.parse(data)

                    res.render('home', { added: true, ProjectTasks: ProjectTasks })
                })
            })
        })
    }
})

/** ======================================================
 *                Logic Part Operations
========================================================*/
main.get('/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile(JsDataBase, (err, data) => {
        if (err) throw err

        const ProjectTasks = JSON.parse(data)

        const CleanedProjectTasks = ProjectTasks.filter(ProjectTask => ProjectTask.id != id)

        fs.writeFile(JsDataBase, JSON.stringify(CleanedProjectTasks), (err) => {
            if (err) throw err

            res.render('home', { ProjectTasks: CleanedProjectTasks, failure: true })
        })
    })
})


main.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile(JsDataBase, (err, data) => {
        if (err) throw err

        const ProjectTasks = JSON.parse(data)
        const ProjectTask = ProjectTasks.filter(ProjectTask => ProjectTask.id == id)[0]

        const ProjectTaskId = ProjectTasks.mainOf(ProjectTask)
        const OrderedProjectTask = ProjectTasks.splice(ProjectTaskId, 1)[0]

        OrderedProjectTask.adding = true

        ProjectTasks.push(OrderedProjectTask)

        fs.writeFile(JsDataBase, JSON.stringify(ProjectTasks), (err) => {
            if (err) throw err

            res.render('home', { ProjectTasks: ProjectTasks })
        })
    })

})

main.listen(PORT, (err) => {
    if (err) throw err

    console.log(`ToDoList is running on port ${PORT}`) // Instead of Port there will be 6000
})


/** ======================================================
 *                Special Code for ID
========================================================*/
function id() {
    return '_' + Math.random().toString(36).substr(2, 9);
}