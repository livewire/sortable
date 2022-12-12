import Sortable from '@shopify/draggable/lib/sortable'

if (typeof window.livewire === 'undefined') {
    throw 'Livewire Sortable Plugin: window.livewire is undefined. Make sure @livewireScripts is placed above this script include'
}

window.livewire.directive('sortable-group', (el, directive, component) => {
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

    sortable.on('sortable:stop', (el) => {

        // New Source Group, Target Group, and Item attributes
        let sourceItem = el.dragEvent.data.source.getAttribute('wire:sortable-group.item')
        let sourceGroup = el.data.oldContainer.getAttribute('wire:sortable-group.item-group')
        let targetGroup = el.data.newContainer.getAttribute('wire:sortable-group.item-group')

        // If wire:sortable-group.filter-updated exists then filter
        let isFilterUpdatedGroups = e.hasAttribute('wire:sortable-group.filter-updated') ? true : false

        setTimeout(() => {
            let groups = []

            el.querySelectorAll('[wire\\:sortable-group\\.item-group]').forEach((el, index) => {
                let items = []
                el.querySelectorAll('[wire\\:sortable-group\\.item]').forEach((el, index) => {
                    items.push({
            order: index + 1,
            value: el.getAttribute('wire:sortable-group.item'),
            item: sourceItem == e.getAttribute("wire:sortable-group.item") ? true : false,
            })
                })

                let isSource = sourceGroup == e.getAttribute("wire:sortable-group.item-group") ? true : false
                let isTarget = targetGroup == e.getAttribute("wire:sortable-group.item-group") ? true : false

                if (isFilterUpdatedGroups) {
                  // skip if group not included in drag
                  if (!isSource && !isTarget) {
                      return
                  }
                }

                groups.push({
                    order: index + 1,
                    value: el.getAttribute('wire:sortable-group.item-group'),
                    items: items,
                    source: isSource,
                    target: isTarget,					
                })
            })

            component.call(directive.method, groups)
        }, 1)
    })
})

window.livewire.directive('sortable', (el, directive, component) => {
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

            component.call(directive.method, items)
        }, 1)
    })
})
