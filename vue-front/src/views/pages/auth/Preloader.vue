<script setup>
</script>

<template>
    <div
        class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center"
                    style="border-radius: 53px">
                    <div class="gap-4 flex flex-col items-center">
                        <div class="flex justify-center items-center border-2 border-orange-500 rounded-full"
                            style="width: 3.2rem; height: 3.2rem">
                            <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
                        </div>
                        <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2">
                            Preparing...</h1>
                        <span class="text-muted-color mb-8">Please wait while system is setting up.</span>
                        <!-- <img src="/demo/images/access/asset-access.svg" alt="Access denied" class="mb-8" width="80%" /> -->
                        <div class="col-span-12 mt-8 text-center">
                            <!-- <Button as="router-link" label="Go to Dashboard" to="/" severity="warn" /> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
