<template>
<div>
    <div class="product-info">
        <p>{{product.product_name}}</p>
        <p>{{product.product_price}}</p>
        <p>{{product.product_description}}</p>
        <img class="detail-img" :src="product.product_image" alt="product image">
    </div>
</div>
</template>

<script>

export default{ 
    name:'',
    props:{
        product:{
            type:Object,
        }
    },
    components:{},
    data(){
        return{
            
        };
    },
    setup(){},
    created(){},
    mounted(){},
    unmounted(){},
    methods:{

        async getProductsDetail() {
            try {
                const response = await axios.get(`import.meta.env.VUE_APP_API_BASE_URL/products/${product_id}`);
                this.selectedProduct = response.data ; 
            }catch(err) {
                console.error(err);
            }
        },

    }
}
</script>

<style scoped>

.product-info {
    margin: 50px 0;
}

    .info-detail{
        height: 200px;
        width: 100%;
        background: yellow;
    }
</style>

<style scoped>
.detail-img {
    width: 35%;
    height: auto;
}
</style>