<script setup>
import reports from '@/components/Shelter/shelter_RescueOp_ReportsCard.vue'
import chats from '@/components/Shelter/shelter_RescueOp_ChatBox.vue'
import ongoing_operations from '@/components/Shelter/shelter_RescueOp_OnGoingOperations.vue'
import { ref } from 'vue'

const tabs = ref([
    { name: 'Community Reports', current: true },
    { name: 'Ongoing Operations', current: false }
    // { name: 'Chats', current: false },
])

const currentTab = ref(tabs.value[0].name)

const updateCurrentTab = (tabName) => {
    currentTab.value = tabName
    tabs.value.forEach((tab) => {
        tab.current = tab.name === tabName
    })
}
</script>
<template>
    <div class="h-screen flex flex-col">
        <div class="hidden sm:block">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex" aria-label="Tabs">
                    <button v-for="tab in tabs" :key="tab.name"
                        :class="[tab.current ? 'border-gray-500 text-gray-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', ' w-fit border-b-2 pb-4 px-6 text-center text-sm font-medium']"
                        :aria-current="tab.current ? 'page' : undefined" @click="updateCurrentTab(tab.name)">
                        {{ tab.name }}
                    </button>
                </nav>
            </div>
        </div>
        <div v-show="currentTab === 'Community Reports'">
            <div class="pt-4 mx-auto flex justify-center">
                <div class="w-fit">
                    <reports />
                </div>
            </div>
        </div>
        <div v-show="currentTab === 'Ongoing Operations'">
            <div class="pt-4 mx-auto flex justify-center">
                <div class="w-fit">
                    <ongoing_operations />
                </div>
            </div>
        </div>
    </div>
</template>