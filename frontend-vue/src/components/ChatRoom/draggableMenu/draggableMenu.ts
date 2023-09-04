export default function () {
    const drawerMinHeight = 36
    const drawerTopOffset = 100
    const drawerOpenRatioHalf = 50

    new Vue({
        el: '#q-app',

        data() {
            return {
                lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                drawerPos: drawerMinHeight
            }
        },

        computed: {
            drawerMaxHeight() {
                return Math.max(0, this.$q.screen.height - drawerTopOffset)
            },

            drawerOpenRatio() {
                return Math.round(Math.max(0, this.drawerPos - drawerMinHeight) / Math.max(1, this.drawerMaxHeight - drawerMinHeight) * 100)
            },

            drawerStyle() {
                return {
                    height: `${this.drawerMaxHeight}px`,
                    transform: `translateY(${-this.drawerPos}px)`
                }
            },

            drawerMode() {
                if (this.drawerOpenRatio > drawerOpenRatioHalf) {
                    return 'full'
                }

                return this.drawerOpenRatio > 0
                    ? 'half'
                    : 'handler'
            }
        },

        methods: {
            slideDrawer(ev) {
                const { direction, delta, isFinal } = ev

                this.drawerPos = Math.max(drawerMinHeight, Math.min(this.drawerMaxHeight, this.drawerPos - delta.y))

                if (isFinal === true) {
                    this.$nextTick(() => {
                        const aboveHalf = this.drawerOpenRatio > drawerOpenRatioHalf
                        const targetHeight = direction === 'up'
                            ? (aboveHalf ? this.drawerMaxHeight : Math.round(this.drawerMaxHeight / 2))
                            : (aboveHalf ? Math.round(this.drawerMaxHeight / 2) : drawerMinHeight)

                        this.animateDrawerTo(targetHeight)
                    })
                }
            },

            cycleDrawer() {
                const targetHeight = this.drawerMode === 'handler'
                    ? Math.round(this.drawerMaxHeight / 2)
                    : (this.drawerMode === 'half' ? this.drawerMaxHeight : drawerMinHeight)

                this.animateDrawerTo(targetHeight)
            },

            animateDrawerTo(height) {
                clearTimeout(this.animateTimeout)

                const diff = height - this.drawerPos

                if (diff !== 0) {
                    this.drawerPos += Math.abs(diff) < 2 ? diff : Math.round(diff / 2)

                    this.animateTimeout = setTimeout(() => {
                        this.animateDrawerTo(height)
                    }, 30)
                }
            }
        },

        beforeDestroy() {
            clearTimeout(this.animateTimeout)
        }
    })
}