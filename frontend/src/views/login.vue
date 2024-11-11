<template>
    <div class="w-full h-screen flex items-center justify-center">
        <div class="border w-screen md:flex md:items-center">
            <div class="w-screen sm:p-[2rem] md:p-[3rem] lg:p-[5rem] xl:p-[10rem]">
                <form action="">
                    <div class="mb-20 sm:text-[10.9px] md:text-[13px] lg:text-[15px]">
                        <router-link to="/" class="flex items-center">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7" />
                            </svg>
                            <span class="text-gray-700 sm:pl-[10px]">Back</span>
                        </router-link>
                    </div>
                    <div class="">
                        <h1 class="font-extrabold sm:text-[18px] md:text-[25px] lg:text-[35px]">
                            Welcome Back
                        </h1>
                        <p class="font-normal sm:text-[10px] md:text-[12px] lg:text-[15px] lg:mb-10">
                            Today is a new day. It's your day. You shape it. <br>
                            Sign in to start managing your projects.
                        </p>
                    </div>
                    <div
                        class="field grid sm:text-[10px] sm:pt-5 sm:space-y-2 md:text-[12px] md:space-y-3 lg:text-[15px]">
                        <label for="email">Email </label>
                        <input v-model="userEmail" type="text" id="email" placeholder="Email Address"
                            class="border rounded-lg py-2 px-5">
                    </div>
                    <div
                        class="field grid sm:text-[10px] sm:pt-5 sm:space-y-2 md:text-[12px] md:space-y-3 lg:text-[15px]">
                        <passwordunhide @updatePassword="handlePasswordUpdate" />
                    </div>
                    <div class="flex justify-between mt-3 sm:text-[9px] md:text-[11px] lg:text-[13px]">
                        <div class="flex items-center space-x-2">
                            <input type="checkbox" id="keep-me-signed-in" class="sm:w-3">
                            <label for="keep-me-signed-in">Keep me signed in</label>
                        </div>
                        <div>
                            <a @click="navigateTo('/forgot-password')" class="cursor-pointer">
                                <u>Forget password</u>
                            </a>
                        </div>
                    </div>
                    <div class="flex justify-center mt-[3rem]">
                        <button @click.prevent="handleLogin()"
                            class="px-6 bg-slate-900 rounded-lg p-2 text-white w-full sm:text-[10px] md:text-[12px] lg:text-[15px]">
                            Login
                        </button>
                    </div>
                    <div class="flex mt-3 justify-center space-x-2 sm:text-[9px] md:text-[11px] lg:text-[13px]">
                        <span>Don't you have an account? </span>
                        <a @click="navigateTo('/buddy-registration')" class="text-blue-500 cursor-pointer">
                            <u>Sign up</u>
                        </a>
                    </div>
                </form>
            </div>
            <div
                class="flex bg-sky-50 pt-[3rem] px-[3rem] sm:hidden md:hidden lg:pl-[5rem] md:pt-[5rem] lg:block lg:pt-[8rem] xl:pl-[15rem]">
                <img :src="dog" alt="animalshelterdog" class="w-[1950px]">
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import passwordunhide from "../components/passwordHide.vue";

const API_BASE_URL = 'https://capstone-furrysafe-deployment.onrender.com';
const router = useRouter();

console.log("login function:)");

// Icons or images
const dog = require('@/assets/images/animalshelterdog.png');

// State variables
const passwordError = ref(false);
const showPassword = ref(false);
const userEmail = ref('');
const userPassword = ref('');
const items = ref([]);
const loginError = ref(''); // Store login error messages

const navigateTo = (path) => {
    router.push(path);
};

const handleLogin = async () => {
    try {
        await getUser();
    } catch (err) {
        console.log(err);
    }
};

const handlePasswordUpdate = (newPassword) => {
    userPassword.value = newPassword;
};

const getUser = async () => {
    try {
        const response = await axios.post(`${process.env.RENDER_URL}/login`, {
            email: userEmail.value,
            password: userPassword.value
        }, {
            withCredentials: true // Include cookies if needed
        });

        items.value = response.data;
        console.log("login", response.data);

        // Save tokens and user data to localStorage
        localStorage.setItem("access_token", items.value.token);
        localStorage.setItem("u_type", items.value.userType);
        localStorage.setItem("u_id", items.value.userID);
        localStorage.setItem("c_id", items.value.characterId);
        localStorage.setItem("address_exists", items.value.address_exists);

        // Redirect based on user type
        if (response.data.success) {
            const userType = response.data.userType;
            if (userType === 'shelter') {
                navigateTo('/shelterDashboard');
            } else if (userType === 'buddy') {
                navigateTo('/buddydashboard');
            } else if (userType === 'admin') {
                navigateTo('/dashboard');
            }
        } else {
            loginError.value = response.data.message || "Invalid login credentials";
            if (response.status === 403 && response.data.message === 'Shelter is not verified') {
                console.log('Shelter is not verified. Please verify your shelter documents.');
            }
        }

    } catch (err) {
        if (err.response) {
            console.log("Error Response Data:", err.response.data);
            console.log("Status Code:", err.response.status);
            loginError.value = err.response.data.message || "Login failed due to server error";
        } else {
            console.log("An ERROR occurred:", err.message);
            loginError.value = "An unexpected error occurred";
        }
    }
};
</script>
