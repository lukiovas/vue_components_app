<template>

    <div class="templates">

         <nav class="navbar navbar-expand-sm navbar-light bg-info mb-3">
        <div class="container">
            <div class="float-left">
                <ul class="nav nav-pills">
                    <li class="nav-item">
                        <a href="http://localhost:8081/components/#/components" class="btn btn-light">Components</a>
                    </li>
                    <li class="nav-item">
                        <a href="http://localhost:8081/components/#/properties" class="btn btn-light">Properties</a>
                    </li>
                    <li class="nav-item">
                        <a href="http://localhost:8081/components/#/Modules" class="btn btn-light">Modules</a>
                    </li>
                    <li class="nav-item">
                        <a href="http://localhost:8081/components/#/Templates" class="btn btn-light active">Templates</a>
                    </li>
                 </ul>
            
            
            </div>
            <!-- <div class="float-right" type="text">
                <div class="input-group mb-3">
  <input type="text" v-model="module_id" @keyup="searchModules(module_id)" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon2">
  <div class="input-group-append">
    <button class="btn input-group-text list-group-item-action" type="button"><i class="fa fa-search"></i></button>
  </div>
</div>
            </div> -->
        </div>
    </nav>

        <button type="button" v-on:click=" addNew()" class="btn btn-primary float-right" data-toggle="modal" data-target="#myModal">
  Add new</button>
  <modal name="create-template" :adaptive="true" height="auto" width="800" :scrollable="true">
      <form class="mb-3 forma" id="forma" @submit.prevent="createTemplate" action="http://localhost:8081/templates" method="post">
        <div class="line">
        <label for="name">Name</label>
        <input type="text" class='form-control' v-model="template.name" id="tempName">   
         <label for="name">Text</label>
        <textarea rows="15" cols="50" type="text" class='form-control' v-model="template.text" id="tempText"></textarea>  
    </div>

        <button type="submit" v-on:click="hide()" name="Save" class="btn btn-primary save">Save</button>
        
        </form> 
       </modal>

       <modal name="show-template" :adaptive="true" height="auto" width="800" :scrollable="true">
       <table class="table template-table">
           <tbody>
               <tr>
                   <td>Name</td>   <td>{{this.template.name}}</td>
               </tr>
               <tr>
                   <td>Text</td>   <td>{{this.template.text}}</td>
               </tr>

           </tbody>
       </table>
       </modal>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Text</th>
                    <th></th>
                    <th></th>
                    </tr>
                </thead>
                
                        <tbody v-for="template in templates" v-bind:key="template.id">
                                <tr class="click">
                                <td @click="editTemplate(template); showTemplate();" scope="col">{{template.name}}</td>
                                <td @click="editTemplate(template); showTemplate();" scope="col">{{template.text}}</td>

                                <td  scope="col"><button @click="editTemplate(template); show();" class="btn btn-warning">Edit</button></td>
                                <td  scope="col"><button @click="deleteTemplate(template.id)" class="btn btn-danger">Delete</button></td>
                                </tr>
                        </tbody>
                
            </table>  
        </div>
    
</template>
<style>
button.btn.btn-primary.float-right {
margin-right: 33px;
margin-bottom: 10px;
}
.template-table { 
    font-weight: 700;
margin: 30px 30px 30px 30px;
}
.click:hover {
    background-color:rgb(239, 243, 249);
    cursor: pointer;
}
.forma {
    margin: 20px 100px;
}
label {
    font-weight: 700;
}
li.nav-item {
    margin-left: 15px;
}
.save {
    
    margin-top: 10px;
    text-align: center;
}
.form-control {
    width: 80%;
}
.line {
   
}

</style>

<script>
import axios from 'axios'

export default {
    name: 'templates',
    components: {
  },
    data () {
        return {
            templates:[],
            selected: [],
            template_id:'',
                      template: { 
                id:'',
                name:'',
                text:'',
                },
                      emptyTemplate: { 
                id:'',
                name:'',
                text:'',
                      },
            edit: false,
        }
    

    },
    
    

    created() {
        this.fetchTemplates();
    },
    methods: {
        addTag (newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.options.push(tag)
      this.value.push(tag)
    },

        fetchTemplates() {
            axios.get('http://localhost:8080/api/Templates').then((response) => {
                this.templates = response.data;
            })

        },
        showTemplate() {
            this.$modal.show('show-template', {template:this.template});
        },
        hideTemplate() {
            this.$modal.hide('show-template');
        },

        show () {
            this.$modal.show('create-template');
        },
        
        hide () {
            this.edit=false;
            this.$modal.hide('create-template');
        },
        addNew() {  
            this.template.id="";
            this.template.name="";
            this.template.text="";
            this.edit=false;
            this.hide();
            this.show();
        },
        

        createTemplate(template) {
                    if (this.edit===false) {
                        axios.post('http://localhost:8080/api/Templates',  
                        this.template).then(data => { 
                            this.template=this.emptyTemplate;
                        this.fetchTemplates();
                    })

                    } else{
                        axios.put('http://localhost:8080/api/Templates/'+this.template.id,  
                        this.template).then(data => {
                            this.template=this.emptyTemplate;
                        this.fetchTemplates();
                                })
                            }
                    },
        editTemplate(template) {
            this.edit=true;
            this.template.id=template.id;
            this.template.name=template.name;
            this.template.text=template.text;
        },
        deleteTemplate(id) {
            if(confirm('Are you sure?')) {
                axios.delete('http://localhost:8080/api/Templates/'+id, { data: {id: 'id'}}).then( data => {this.fetchTemplates()} )
            }
        }
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
