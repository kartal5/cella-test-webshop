<template>
    <div id="install-banner">
        <button id="install-button" @click="installApp">Install</button>
    </div>
</template>

<script>
    export default {
        name: 'PwaBanner',
        methods: {
            installApp() {
                if (this.deferredPrompt) {
                    this.deferredPrompt.prompt();

                    this.deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the A2HS prompt');
                        } else {
                            console.log('User dismissed the A2HS prompt');
                        }
                        this.deferredPrompt = null;
                    });
                }
            }
        },
    };

    if ('serviceWorker' in navigator) {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;
        });
    }
</script>
