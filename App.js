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
            classes.forEach((Class, class_index) => {
                base('Classes').find(Class).then((class_record) => {
                    const my_record = {
                        class : class_record.fields.Name,
                        students : []
                    }
                    myArr.push(my_record)
        
                    const students = class_record.fields.Students
                    students.forEach((student, student_index) => {
                        base('Students').find(student).then((student_record) => {
                            myArr.map((item => {
                                if(item.class === class_record.fields.Name){
                                    item.students.push(student_record.fields.Name)
                                    return item
                                }
                                return item
                            }))

                            if(student_index === students.length-1 && class_index === classes.length-1){
                                console.log(myArr)
                            }
                        }).catch((err) => {console.error(err)})
                    })
                }).catch((err) => {console.error(err)})
            })
        })
    })

    // setTimeout(() => {
    //     console.log(myArr)
    // }, 3000)
}


const queryBuilder = (array) => {
    let myFilters = array.map((record) => {
        return "RECORD_ID() = " + "\'" + record + "\'"
    }).join(",")

    return "OR(" + myFilters + ")"
}
const anotherMethod = () => {
    let allCat = []

    base('Students')
    .select({
        filterByFormula: `{Name} = "${name}"`
    })
    .firstPage((err, records) => {
        if (err) console.error(err)

        if(records.length == 0){
            console.log("USER DOES NOT EXIST")
        }

        const classes = records[0].fields.Classes
        const classQuery = queryBuilder(classes)

        base('Classes').select({
            filterByFormula: classQuery
        })
        .firstPage((err, classRecord) => {
            let allCat = classRecord.map((cls) => {
                return {
                    class: cls,
                    students: []
                }}
            )

            const students = [].concat.apply([], classRecord.map((rec) => {
                return rec.fields.Students
            }))
            const studentQuery = queryBuilder(students)

            base('Students').select({
                filterByFormula: studentQuery
            })
            .firstPage((err, studentRecord) => {
                studentRecord.forEach((rec) => {
                    allCat = allCat.map((cat) => {
                        if(rec.fields.Classes.includes(cat.class.id)){
                            cat.students.push(rec.fields.Name)
                            return cat
                        }
                        return cat
                    })
                })
                allCat = allCat.map((rec) => {
                    rec.class = rec.class.fields.Name
                    return rec
                })

                console.log(allCat)
            })
        })
    })

}

// fetchRecord()
anotherMethod()
// alternative()