<template>
    <v-container>
    <v-row no-gutters>
     <v-col sm="10" class="mx-auto">
       <v-card class="pa-5">
          <v-card-title class="headline">
          Add New Post
          </v-card-title>
           <v-divider>
           
           </v-divider>
           <v-form ref="form" @submit.prevent="submitForm"  class="pa-5" enctype="multipart/form-data">
           <v-text-field label="Title" v-model="post.title"  prepend-icon="mdi-note" :rules="rules">
           </v-text-field>

           <v-text-field label="Category" v-model="post.category" prepend-icon="mdi-view-list" :rules="rules">
           </v-text-field>

           <v-textarea label="Content" v-model="post.content" prepend-icon="mdi-note-plus" :rules="rules">
           </v-textarea>

           <v-file-input @change="selectFile" :rules="rules" show-size counter multiple label="Select Image">
           </v-file-input>

           <v-btn type="submit" class="mt-3" color="primary"> Add Post</v-btn>
           </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import API from "./../api"
export default {
    data() {
        return{
            rules: [(value)=>!!value || "This field is required!"],
            post: {
                title: "",
                category: "",
                content: "",
                image: ""
            },
            image: ""
        };  
    },
    methods: {
        selectFile(file){
            this.image = file[0];
        },
        async submitForm(){
            const formData = new FormData();
            formData.append('image', this.image);
            formData.append('title', this.post.title);
            formData.append('category', this.post.category);
            formData.append('content', this.post.content);
            if(this.$refs.form.validate()){
                const response = await API.createPost(formData);
                this.$router.push({name: 'home', params: {message: response.message}});
            }


        },
    },
};
</script>