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
            <div class='col-5'>
                <div class='form-group'>
                    <label for='name' v-if="index == 1">Name</label>
                    <input type="text" class="form-control" v-model="course.course" placeholder="Course Name" id='name'>
                </div>
            </div>
            <div class='col-3'>
                <div class='form-group'>
                    <label for='unit' v-if="index == 1">Unit</label>
                    <input type="number" class="form-control" v-model="course.unit" placeholder='Unit' id='unit'>
                </div>
            </div>
            <div class='col-3'>
                <div class='form-group'>
                    <label for='grade' v-if="index == 1">Grade</label>
                    <select class="form-control" v-model="course.grade" id='grade'>
                        <option v-for='grade in grades' :value="grade" :key="grade.value">{{ grade.letter }}</option>
                    </select>
                </div>
            </div>
            <div class='col-1'>
                <div class='form-group'>
                    <label for='index' v-if="index == 1">&nbsp;</label><br v-if='index == 1'>
                    <slot name="close"></slot>
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
        stored: {},
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
        removeCourse(course){
            this.courses = this.courses.filter( x => course !== x );
            new this.toast({type:'success',title:'Course removed!'});
        },
        saveCourses(){
            if(this.stored[this.saved]){
                new this.toast({type:'error',title:'Failed to save! Name already exists!'});
            }else{
                Vue.set(this.stored,this.saved,this.courses);
                this.saved = '';
                new this.toast({type:'success',title:'Result saved!'});
                this.saveToLocalStorage();
            }
        },
        loadCourses(){
            if(this.stored[this.saved]){
                this.courses = this.stored[this.saved];
                this.saved = '';
                new this.toast({type:'success',title:'Result loaded!'});
            }else{
                new this.toast({type:'error',title:'No result saved with such name!'});
            }
        },
        saveToLocalStorage(){
            window.localStorage.setItem('gp-calc',JSON.stringify(this.stored))
        },
        removeFromStored(key){
            new this.swal({
                title: 'Delete Saved Record?',
                text: 'Are you sure you want to delete? This action can\'t be reversed',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete',
            }).then((result) => {
                if (result.value) {
                    Vue.delete(this.stored,key);
                    new this.toast({type:'success',title:'Result deleted!'});
                    this.saveToLocalStorage();
                }else{
                    new this.toast({type:'success',title:'Cancelled deletion!'});
                }
            })
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
        },
        anyStoredResults(){
            return Object.keys(this.stored).length;
        },
        getStoredResults(){
            return this.stored
        }
    },
    mounted(){
        this.swal = sweetAlert;
        this.toast = this.swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
        if(window.localStorage.key('gp-calc')){
            this.stored = JSON.parse(window.localStorage.getItem('gp-calc'));
        }
    },
    watch: {
        saved(){
            this.saved = this.saved.split(' ').join('_')
        }
    }
}).$mount('#app');
