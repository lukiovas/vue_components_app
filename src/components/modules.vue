<template>

    <div class="modules">

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
                        <a href="http://localhost:8081/components/#/Modules" class="btn btn-light active">Modules</a>
                    </li>
                    <li class="nav-item">
                        <a href="http://localhost:8081/components/#/Templates" class="btn btn-light">Templates</a>
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
  <modal name="create-module" :adaptive="true" height="auto" width="800" :scrollable="true">
      <form class="mb-3 forma" id="forma" @submit.prevent="createModule" action="http://localhost:8081/modules" method="post">
        <div class="line">
        <label for="name">Name</label>
        <input type="text" class='form-control' v-model="module.name" id="modName">
        <label for="components" class="typo__label">Components</label>
  <multiselect v-model="module.component" tag-placeholder="Add this as new component" id="modules" placeholder="Search or add a component" label="name" :allow-empty="true" track-by="id" :options="this.components" :max-height="150" :taggable="true" @tag="addTag"></multiselect>
  <pre class="language-json"><code></code></pre>   
        <label for="templates" class="typo__label">Templates</label>
  <multiselect v-model="module.templates" tag-placeholder="Add this as new template" id="modules" placeholder="Search or add a template" label="name" :allow-empty="true" track-by="id" :options="this.templates" :max-height="150" :multiple="true" :taggable="true" @tag="addTag"></multiselect>
  <pre class="language-json"><code></code></pre>    
    </div>

        <button type="submit" v-on:click="hide()" name="Save" class="btn btn-primary save">Save</button>
        
        </form> 
       </modal>

       <modal name="show-module" :adaptive="true" height="auto" width="800" :scrollable="true">
       <table class="table module-table">
           <tbody>
               <tr>
                   <td>Name</td>   <td>{{this.module.name}}</td>
               </tr>
               <tr>
                   <td>Component</td>   <td>{{this.module.component.name}}</td>
               </tr>
               <tr>
                   <td>Templates</td>   <td><ul class="list-group"><li class="list-group-item item" v-for="template in this.module.templates" v-bind:key="template.id">{{template.name}}</li></ul></td>
               </tr>

           </tbody>
       </table>
       </modal>
            <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Component</th>
                    <th scope="col">Templates</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    </tr>
                </thead>
                
                        <tbody v-for="module in modules" v-bind:key="module.id">
                                <tr class="click">
                                <td @click="editModule(module); showModule();" scope="col">{{module.name}}</td>
                                <td @click="editModule(module); showModule();" scope="col"><b>{{module.component.name}}</b></td>
                                <td @click="editModule(module); showModule();" scope="col"><ul class="list-group"><li class="list-group-item item" v-for="template in module.templates" v-bind:key="template.id"><b>{{template.name}}</b></li></ul></td>

                                <td  scope="col"><button @click="editModule(module); generateModule(module)" class="btn btn-success">Generate</button></td>
                                <td  scope="col"><button @click="editModule(module); show();" class="btn btn-warning">Edit</button></td>
                                <td  scope="col"><button @click="deleteModule(module.id)" class="btn btn-danger">Delete</button></td>
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
.module-table { 
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
import Multiselect from 'vue-multiselect'
import components from '@/components/components.vue';

export default {
    name: 'modules',
    components: {
    Multiselect
  },
    data () {
        return {
            modules:[],
            components:[],
            templates:[],
            selected: [],
            module_id:'',
            module: { 
                id:'',
                name:'',
                templates: [],
                component: {
                    id:'',
                    name:'',
                    property: {
                        id:'',
                        name:'',
                        type:'',
                    },
                    properties : [],
                },
                },
                      emptyModule: { 
                id:'',
                name:'',
                templates: [],
                component: {
                    id:'',
                    name:'',
                    property: {
                        id:'',
                        name:'',
                        type:'',
                        },
                    properties : [],
                 },
                      },
                      template: { 
                id:'',
                text:'',
                },
                      emptyTemplate: { 
                id:'',
                text:'',
                      },
            edit: false,
        }
    

    },
    
    

    created() {
        this.fetchComponents();
        this.fetchModules();
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
  
        
        fetchModules() {
                        axios.get('http://localhost:8080/api/Modules').then((response) => {
                this.modules = response.data;
            })

        },
        fetchComponents() {
                        axios.get('http://localhost:8080/api/components').then((response) => {
                this.components = response.data;
            })

        },
        fetchTemplates() {
            axios.get('http://localhost:8080/api/Templates').then((response) => {
                this.templates = response.data;
            })

        },
        showModule() {
            this.$modal.show('show-module', {module:this.module});
        },
        hideModule() {
            this.$modal.hide('show-module');
        },

        show () {
            this.$modal.show('create-module');
        },
        
        hide () {
            this.edit=false;
            this.$modal.hide('create-module');
        },
        addNew() {  
            this.module.id="";
            this.module.name="";
            this.module.component="";
            this.module.templates=[];
            this.edit=false;
            this.hide();
            this.show();
        },
        

        createModule(module) {
                    if (this.edit===false) {
                        axios.post('http://localhost:8080/api/Modules',  
                        this.module).then(data => { 
                            this.module=this.emptyModule;
                        this.fetchModules();
                    })

                    } else{
                        axios.put('http://localhost:8080/api/Modules/'+this.module.id,  
                        this.module).then(data => {
                            this.module=this.emptyModule;
                        this.fetchModules();
                                })
                            }
                    },
        editModule(module) {
            this.edit=true;
            this.module.id=module.id;
            this.module.name=module.name;
            this.module.component=module.component;
            this.module.templates=module.templates;
        },
        deleteModule(id) {
            if(confirm('Are you sure?')) {
                axios.delete('http://localhost:8080/api/Modules/'+id, { data: {id: 'id'}}).then( data => {this.fetchModules()} )
            }
        },
        generateModule(module) {
            axios.post('http://localhost:8080/api/Modules/'+module.id, this.module)
            .then( data => {this.fetchModules()} )
        }
    
        
    }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
