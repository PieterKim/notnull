<template>
<div>
    <p>아녈하세욘</p>
</div>
</template>
<script>

export default{ 
    name:'',
    components:{},
    data(){
        return{
            posts:[],
        };
    },
    setup(){},
    created(){},
    mounted(){},
    unmounted(){},
    methods:{

        async getOderList(){
            try{
                const res = await api.get(`/profile/posts`,{withCredentials:true})
                this.posts = res.data
            }catch(err){
                console.log(err)
            }
        }

    }
}
</script>