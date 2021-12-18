var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keysUrvtv0m0GGiz8'}).base('app8ZbcPx7dkpOnP0');

const name = "Joe"
const myArr = []




const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

const getRecords = async (records) => {
    await asyncForEach(records, async (record) => {
        const classes = record.fields.Classes
        await asyncForEach(classes, async (Class) => {
            const class_record = await base('Classes').find(Class)
            const my_record = {
                class : class_record.fields.Name,
                students : []
            }
            myArr.push(my_record)

            const students = class_record.fields.Students
            await asyncForEach(students, async (student) => {
                const student_record = await base('Students').find(student)
                myArr.map((item => {
                    if(item.class === class_record.fields.Name){
                        item.students.push(student_record.fields.Name)
                        return item
                    }
                    return item
                }))
            })
        })
    })

    console.log(myArr)
}

const fetchRecord = () => {
    base('Students')
    .select({
        filterByFormula: `{Name} = "${name}"`
    })
    .firstPage((err, records) => {
        if (err) console.error(err)

        if(records.length == 0){
            console.log("USER DOES NOT EXIST")
        }

        getRecords(records)
    })
}






const alternative = () => {
    base('Students')
    .select({
        filterByFormula: `{Name} = "${name}"`
    })
    .firstPage((err, records) => {
        if (err) console.error(err)

        if(records.length == 0){
            console.log("USER DOES NOT EXIST")
        }

        records.forEach((record) => {
            const classes = record.fields.Classes
            classes.forEach((Class) => {
                base('Classes').find(Class).then((class_record) => {
                    const my_record = {
                        class : class_record.fields.Name,
                        students : []
                    }
                    myArr.push(my_record)
        
                    const students = class_record.fields.Students
                    students.forEach((student) => {
                        base('Students').find(student).then((student_record) => {
                            myArr.map((item => {
                                if(item.class === class_record.fields.Name){
                                    item.students.push(student_record.fields.Name)
                                    return item
                                }
                                return item
                            }))
                        }).catch((err) => {console.error(err)})
                    })
                }).catch((err) => {console.error(err)})
            })
        })
    })

    setTimeout(() => {
        console.log(myArr)
    }, 3000)
}


// fetchRecord()


alternative()