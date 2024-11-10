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
                        <input type="text" id="email" placeholder="Email Address" class="border rounded-lg py-2 px-5">
                    </div>
                    <div
                        class="field grid sm:text-[10px] sm:pt-5 sm:space-y-2 md:text-[12px] md:space-y-3 lg:text-[15px]">
                        <passwordunhide />
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
<script>
import axios from "axios";
import passwordunhide from "../components/passwordHide.vue";

const API_BASE_URL = 'https://capstone-furrysafe-deployment.onrender.com';

export default {
    components: { passwordunhide },
    data() {
        return {
            // Icons or images
            dog: require('@/assets/images/animalshelterdog.png'),
            // Password hide/unhide
            passwordError: false,
            showPassword: false,
            // Credential input
            userEmail: '',
            userPassword: '',
            items: [],
            loginError: '' // Store login error messages
        };
    },
    methods: {
        navigateTo(path) {
            this.$router.push(path);
        },
        async handleLogin() {
            try {
                await this.getUser();
            } catch (err) {
                console.log(err);
            }
        },
        async getUser() {
            try {
                const response = await axios.post(`${API_BASE_URL}/login`, {
                    email: this.userEmail,
                    password: this.userPassword
                }, {
                    withCredentials: true // Include cookies if needed
                });

                this.items = response.data;
                console.log("login", response.data);

                // Save tokens and user data to localStorage
                localStorage.setItem("access_token", this.items.token);
                localStorage.setItem("u_type", this.items.userType);
                localStorage.setItem("u_id", this.items.userID);
                localStorage.setItem("c_id", this.items.characterId);
                localStorage.setItem("address_exists", this.items.address_exists);

                // Redirect based on user type
                if (response.data.success) {
                    const userType = response.data.userType;
                    if (userType === 'shelter') {
                        this.navigateTo('/shelterDashboard');
                    } else if (userType === 'buddy') {
                        this.navigateTo('/buddydashboard');
                    } else if (userType === 'admin') {
                        this.navigateTo('/dashboard');
                    }
                } else {
                    this.loginError = response.data.message || "Invalid login credentials";
                    if (response.status === 403 && response.data.message === 'Shelter is not verified') {
                        console.log('Shelter is not verified. Please verify your shelter documents.');
                    }
                }

            } catch (err) {
                if (err.response) {
                    console.log("Error Response Data:", err.response.data);
                    console.log("Status Code:", err.response.status);
                    this.loginError = err.response.data.message || "Login failed due to server error";
                } else {
                    console.log("An ERROR occurred:", err.message);
                    this.loginError = "An unexpected error occurred";
                }
            }
        }
    }
};
</script>
