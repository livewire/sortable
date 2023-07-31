import Sortable from '@shopify/draggable/lib/sortable'

if (typeof window.Livewire === 'undefined') {
    throw 'Livewire Sortable Plugin: window.Livewire is undefined. Make sure @livewireScripts is placed above this script include'
}

window.Livewire.directive('sortable-group', ({el, directive, component}) => {
    if (directive.modifiers.includes('item-group')) {
        // This will take care of new items added from Livewire during runtime.
        el.closest('[wire\\:sortable-group]').livewire_sortable.addContainer(el)
    }

    // Only fire the rest of this handler on the "root" directive.
    if (directive.modifiers.length > 0) return

    let options = { draggable: '[wire\\:sortable-group\\.item]' }

    if (el.querySelector('[wire\\:sortable-group\\.handle]')) {
        options.handle ='[wire\\:sortable-group\\.handle]'
    }

    const sortable = el.livewire_sortable = new Sortable([], options);

    sortable.on('sortable:stop', () => {
        setTimeout(() => {
            let groups = []

            el.querySelectorAll('[wire\\:sortable-group\\.item-group]').forEach((el, index) => {
                let items = []
                el.querySelectorAll('[wire\\:sortable-group\\.item]').forEach((el, index) => {
                    items.push({ order: index + 1, value: el.getAttribute('wire:sortable-group.item')})
                })

                groups.push({
                    order: index + 1,
                    value: el.getAttribute('wire:sortable-group.item-group'),
                    items: items,
                })
            })

            component.$wire.call(directive.method, groups)
        }, 1)
    })
})

window.Livewire.directive('sortable', ({el, directive, component}) => {
    // Only fire this handler on the "root" directive.
    if (directive.modifiers.length > 0) return

    let options = { draggable: '[wire\\:sortable\\.item]' }

    if (el.querySelector('[wire\\:sortable\\.handle]')) {
        options.handle ='[wire\\:sortable\\.handle]'
    }

    const sortable = new Sortable(el, options);

    sortable.on('sortable:stop', () => {
        setTimeout(() => {
            let items = []

            el.querySelectorAll('[wire\\:sortable\\.item]').forEach((el, index) => {
                items.push({ order: index + 1, value: el.getAttribute('wire:sortable.item')})
            })

            component.$wire.call(directive.method, items)
        }, 1)
    })
})
