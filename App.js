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
// anotherMethod()
// alternative()

function solution(A) {
    let B = A.filter(item => {
        return item > 0
    })
    B.sort()

    let track = 0
    let current = 1
    let prev = 0
    console.log(B)
    for(let i = 0; i < B.length; i++){
        if(B[i] == current){
            prev = current
            current++
        }
        else if(B[i] == prev){
            
        }
        else {
            return current
        }
    }
    return current
}

function firstUnique(arr){
    for(let i = 0; i < arr.length; i++){
        let ar = arr[i]
        if(arr.filter(val => (val === ar)).length === 1){
            return ar
        }
    }
    return -1
}
function anotherUnique(arr){
    let newArr = []
    for(let i = 0; i < arr.length; i++){}
}
// console.log(firstUnique([4,10,5,4,2,10]))

function interwieve(A, B){
    let aLen = A
    let bLen = B
    let myStr = ""

    if(A + B == 1){
        return A ? "a" : "b"
    }

    if(A == B){
        return wieve(A+B, true)
    }
    else {
        let aGreater = A > B
        let start = true
        let curA = aGreater

        for(let i = 0; i < A + B; i++){
            if(aLen == bLen){
                return myStr + wieve(aLen+bLen, curA)
            }

            if(start){
                myStr += aGreater ? "aa" : "bb"
                if(aGreater){
                    aLen -= 2
                }
                else {
                    bLen -= 2
                }
                i++
            }
            else {
                myStr += aGreater ? "b" : "a"
                if(aGreater){
                    bLen -= 1
                }
                else {
                    aLen -= 1
                }
            }
            curA = !curA
            start = !start
        }
    }
    return myStr
}

function wieve(len, sta){
    myStr = ""
    for(let i = 0; i < len; i+=2){
        myStr += sta ? "ab" : "ba"
    }
    return myStr
}

function tester(message, K){
    if(K == 0){
        return ""
    }
    if(K == message.length){
        return message
    }

    let newStr = message.substring(0, K)
    let allWords = message.split(" ")
    let allSubWords = newStr.split(" ")
    if(allWords.includes(allSubWords[allSubWords.length-1])){
        return allSubWords.join(" ")
    }
    else {
        allSubWords.pop()
        return allSubWords.join(" ")
    }
}

function factory(A){
    let totalSum = 0
    let biggest = 0
    let filters = 0

    for(let i = 0; i < A.length; i++){
        biggest = Math.max(A[i], biggest)
        totalSum += A[i]
    }
    
    let aim = totalSum/2
    let current = totalSum
    let newBiggest = 0

    while (current > aim){
        let done = false
        current = 0

        for(let i = 0; i < A.length; i++){
            if(A[i] == biggest && !done){
                done = true
                A[i] /= 2
                filters++
            }
            newBiggest = Math.max(A[i], newBiggest)
            current += A[i]
        }

        biggest = newBiggest
        newBiggest = 0
    }
    return filters
}

function cars(P, S){
    P.sort()
    let emptySeat = 0
    let carsRem = 0

    for(let i = 0; i < P.length; i++){
        emptySeat += S[i] - P[i]
    }

    let more = true
    while(more){
        more = false
        for(let i = 0; i < P.length; i++){
            if(P[i] <= emptySeat){
                emptySeat -= P[i]
                P[i] = 1000000
                carsRem++
                more = true
            }
        }
    }
    return P.length - carsRem
}


console.log(cars([2, 3, 4, 2], [2, 5, 7, 2]))
// console.log(factory([3, 0, 5]))
// console.log(tester("Codility we test coders", 14))

// console.log(interwieve(0, 1))

// console.log(solution([0,2,3,4, 9]))


// function interwieve(A, B){
//     let aLen = A
//     let bLen = B
//     let myStr = ""

//     if(A == B){
//         return wieve(A+B, curA)
//     }
//     else if(A > B){
//         let curA = true
//         for(let i = 0; i < A + B; i++){
//             if(aLen == bLen){
//                 return myStr + wieve(aLen+bLen, curA)
//             }

//             if(curA){
//                 myStr += "aa"
//                 aLen -= 2
//                 i++
//             }
//             else {
//                 myStr += "b"
//                 bLen -= 2
//             }
//             curA = !curA
//         }
//     }
//     return myStr
// }