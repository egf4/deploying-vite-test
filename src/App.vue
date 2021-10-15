<script setup lang="ts">
import { reactive, ref } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';
import { getDataFromAL } from './utils';

const data = reactive({
    customers: [
        {
            name: 'cust 1',
            age: 42
        }
    ]
});

const addCustToList = async () => {
    const results = await getDataFromAL('GetCustomers', { cnt: data.customers.length }) as [typeof data['customers']];
    console.log({ results });
    const customerListFromServer = results[0];
    const firstCustomer = customerListFromServer[0];
    data.customers.push(firstCustomer);
};

addCustToList(); // add 1 when starting... (takes 1.5 sec)
</script>

<template>
    <h1>Text from Vue app</h1>
    <HelloWorld msg="Text from props111">
    </HelloWorld><br><br><div id="customers">
    <button @click="addCustToList">Get more!!!!!</button>
    <ul v-for="c in data.customers">
    <li>Name: {{c.name}}, age: {{c.age}}</li>
    </ul>
    </div>
</template>

<style>
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

#app {
    color: darkmagenta;
}

h1 {
    text-align: center;
}

#customers {
    margin-left: 1.5rem;
}

#customers button {
    margin: 0.5rem 0;
    padding: 0.25rem;
}
</style>
