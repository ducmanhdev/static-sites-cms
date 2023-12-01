export default defineAppConfig({
    ui: {
        primary: 'sky',
        gray: 'cool',
        button: {
            default: {
                size: 'lg',
            },
        },
        input: {
            default: {
                size: 'lg',
            },
        },
        select: {
            default: {
                size: 'lg',
            },
        },
        radio: {
            default: {
                size: 'lg',
            },
        },
        checkbox: {
            default: {
                size: 'lg',
            },
        },
        badge: {
            default: {
                size: 'md',
            },
        },
        pagination: {
            default: {
                prevButton: {
                    class: 'self-stretch flex items-center justify-center',
                },
                nextButton: {
                    class: 'self-stretch flex items-center justify-center',
                },
            },
        },
        verticalNavigation: {
            inactive: 'text-black',
            icon: {
                inactive: 'text-black',
            },
        },
        tabs: {
            list: {
                height: 'h-12',
                tab: {
                    height: 'h-10',
                },
            },
        },
    },
});
