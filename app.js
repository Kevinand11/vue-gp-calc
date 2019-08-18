Vue.component('course',{
    data(){
        return {
            grades:[
                {letter:'A',value:5},
                {letter:'B',value:4},
                {letter:'C',value:3},
                {letter:'D',value:2},
                {letter:'E',value:1},
                {letter:'F',value:0},
            ]
        }
    },
    props: {
        'course': {
            required:true,
            type: Object
        },
        'index': {
            required:true,
            type: Number
        }
    },
    template: `
        <div class="row">
            <div class='col-1'>
                <div class='form-group'>
                    <label for='index'>&nbsp;</label>
                    <span id='index'>{{ index }}</span>
                </div>
            </div>
            <div class='col-5'>
                <div class='form-group'>
                    <label for='course'>Name</label>
                    <input type="text" class="form-control" v-model="course.course" placeholder="Course Name" id='name'>
                </div>
            </div>
            <div class='col-3'>
                <div class='form-group'>
                        <label for='unit'>Unit</label>
                    <input type="number" class="form-control" v-model="course.unit" placeholder='Unit' id='unit'>
                </div>
            </div>
            <div class='col-3'>
                <div class='form-group'>
                        <label for='grade'>Grade</label>
                    <select class="form-control" v-model="course.grade" id='grade'>
                        <option v-for='grade in grades' :value="grade" :key="grade.value">{{ grade.letter }}</option>
                    </select>
                </div>
            </div>
        </div>
    `,
});

new Vue({
    data:{
        courses: [
            {
                course:'',
                unit:null,
                grade:{
                    letter: 'A',
                    value: 5
                }
            },
        ],
        saved: ''
    },
    methods:{
        addCourse(){
            this.courses.push({
                    course:'',
                    unit:null,
                    grade:{
                        letter: 'A',
                        value: 5
                    }
                }
            );
        },
        saveCourses(){
            window.localStorage.setItem(`gp-calc-${this.saved}`,JSON.stringify(this.courses))
            this.saved = ''
            alert('Saved!')
        },
        loadCourses(){
            if(window.localStorage.key(`gp-calc-${this.saved}`)){
                this.courses = JSON.parse(window.localStorage.getItem(`gp-calc-${this.saved}`))
                this.saved = ''
                alert('Loaded!')
            }else{
                alert('No record saved with such name')
            }
        }
    },
    computed:{
        getTotalUnits(){
            return this.courses.reduce((sum,course)=>{
                return sum + Number(course.unit)
            },0)
        },
        getTotalGrades(){
            return this.courses.reduce((sum,course)=>{
                return sum + Number(course.grade.value * course.unit)
            },0)
        },
        getGP(){
            let gp = this.getTotalGrades/this.getTotalUnits
            return gp ? Number(gp).toFixed(2) : 0
        },
        shouldDisable(){
            return this.saved === ''
        }
    }
}).$mount('#app');


