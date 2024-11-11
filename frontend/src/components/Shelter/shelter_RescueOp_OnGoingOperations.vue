<script setup>
import { ref, onMounted, computed } from 'vue';
import statusbuttons from '@/components/Shelter/shelter_RescueOp_OnGoingOperations_Button.vue';
import previewhover from '@/components/Shelter/shelter_HoverName.vue';
import axios from "axios";

const showRescueCancelButtons = ref(false);
const showSuccessMessage = ref(false);
const hoveredIndex = ref(null); // Track the hovered item index

import viewpostdetials from '@/components/Shelter/shelter_RescueOp_ReportViewdetailsModal.vue';

// view detials on grid images
const selectedPostViewDetailsId = ref(null);
const toggleModalViewDetails = (id) => {
    selectedPostViewDetailsId.value = selectedPostViewDetailsId.value === id ? null : id;
    const foundPost = posts.value.find(post => post.post_id === selectedPostViewDetailsId.value);

    if (foundPost) {
        selectedPostDetails.value = foundPost
        console.log("found post", selectedPostDetails.value)
    }
};
const handleStatusUpdate = () => {
    // Refresh the reports list
    retrieveReports();
}

//functions 
let selectedPost = ref(null)
let posts = ref([])
let selectedPostDetails = ref([])
let _shelter_id = localStorage.getItem('c_id')
const API_BASE_URL = 'https://capstone-furrysafe-deployment.onrender.com';
async function retrieveReports() {
    try {
        console.log("retrieveReports")
        const response = await axios.post(`${API_BASE_URL}/getongoingoperations`, {
            _shelter_id: _shelter_id,
            _status: 'Pending'
        });

        if (response.data && response.data.length > 0) {
            posts.value = response.data
        }
        console.log("post value", posts.value)
    }
    catch (err) {
        console.log("error in retrieve operations", err)
    }
}

onMounted(async () => {
    retrieveReports()
})
</script>

<template>
    <div>
        <div v-for="(report, index) in posts" :key="report.post_id"
            class="bg-white border border-gray-200 shadow-md shadow-gray-100 rounded-lg mb-4">
            <div class="h-[2rem] bg-white border-b-2 rounded-t-lg" />
            <div class="w-full bg-gray-50 border-b-2 relative group">
                <button @click="toggleModalViewDetails(report.post_id)" class="w-full flex justify-center">
                    <img class="flex-shrink-0 w-[20rem] h-[30rem] object-cover group-hover:filter group-hover:blur-sm"
                        :src="report.photos[0]" alt="image post" />
                    <span
                        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block font-semibold text-sm text-white">
                        View Details</span>
                </button>
                <viewpostdetials v-if="selectedPostViewDetailsId === report.post_id"
                    :selectedPostDetails="selectedPostDetails" @close="toggleModalViewDetails(report.id)" />
            </div>
            <div class="my-[1rem] px-[2rem] py-3 text-gray-700 grid gap-y-1">
                <span class="flex gap-5 text-sm items-center">
                    Reported by:
                    <RouterLink to="" class="font-bold text-base">
                        <div @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null"
                            class="relative inline-block">
                            <span class="hover:underline cursor-pointer">{{ report.posted_by }}</span>
                        </div>
                        <!-- reportId use to get the id of the hover username para ma compare sa previewhover component side -->
                        <!-- <previewhover v-if="hoveredIndex === index" :_user_id="report.user_id" class="absolute z-10" /> -->
                        <div @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null">
                            <previewhover v-if="hoveredIndex === index" :_user_id="report.user_id"
                                class="absolute z-10" />
                        </div>
                        <!-- <span class="text-[12px] font-medium border rounded-xl ml-3 px-2">badge</span> -->
                    </RouterLink>
                </span>
                <span class="flex gap-5 text-sm">Report Type:
                    <h1 class="font-bold text-sm flex gap-3">{{ report.post_type }}</h1>
                </span>
                <span class="flex text-sm gap-3">Animal Status:
                    <span class="font-semibold text-[15px]">{{ report.pet_condition }}</span>
                </span>
                <span class="flex gap-10 text-sm">Location:
                    <p class="font-semibold text-sm">{{ report.report_address_location }}</p>
                </span>

            </div>
            <div>
                <statusbuttons :postId="report.post_id" @statusUpdated="handleStatusUpdate"/>
            </div>
        </div>
    </div>
</template>

<!-- 
<template>
    <div>
        <div v-for="(report, index) in posts" :key="index" class="bg-white shadow-md rounded-lg mb-4">
            <div class="h-[2rem] bg-white border-b-2 rounded-t-lg" />
            <div class="w-full bg-gray-50 border-b-2 relative group">
                <img class="mx-auto flex-shrink-0 w-[20rem] group-hover:filter group-hover:blur-sm"
                    :src="report.photos[0]" alt="image post" />
                <RouterLink to="/viewreportdetails"
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block">
                    <span class="font-semibold text-sm text-white">View Details </span>
                </RouterLink>
            </div>
            <div class="my-[1rem] px-[2rem] py-3 text-gray-700 grid gap-y-1">
                <span class="flex gap-5 text-sm items-center">
                    Reported by:
                    <RouterLink to="" class="font-bold text-base">
                        <div @mouseenter="hoveredIndex = index" @mouseleave="hoveredIndex = null"
                            class="relative inline-block">
                            <span class="hover:underline cursor-pointer">{{ report.posted_by }}</span>
                            <previewhover v-if="hoveredIndex === index" class="absolute z-10" />
                        </div>
                    </RouterLink>
                </span>
                <span class="flex gap-5 text-sm">Report Type:
                    <h1 class="font-bold text-sm flex gap-3">{{ report.post_type }}</h1>
                </span>
                <span class="flex text-sm gap-3">Animal Status:
                    <span class="font-semibold text-[15px]">{{ report.pet_condition }}</span>
                </span>
                <span class="flex gap-10 text-sm">Location:
                    <p class="font-semibold text-sm">{{ report.report_address_location }}</p>
                </span>

            </div>
            <div>
                <statusbuttons />
            </div>
        </div>
    </div>
</template> -->