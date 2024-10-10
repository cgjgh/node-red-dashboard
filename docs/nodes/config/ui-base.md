---
description: Configure the base UI settings of Node-RED Dashboard 2.0 to tailor the dashboard environment to your needs.
props:
    Path: The endpoint proceeding the host of Node-RED where your UI will be accessible
    App Icon: Allows you to set a custom icon for your application. Provide the URL to the App Icon, which will be displayed as the app icon and in the browser tab.
    Include Page Path in Label: The side navigation lists all available Pages for the Dashboard. By default, this will just show the page name, but this option allows you to also show the page's path.
    Side Navigation Style: The style the side navigation menu should use (default, fixed, icon, temporary, none)
---

<script setup>
    import AddedIn from '../../components/AddedIn.vue';
    import SideBySideImages from '../../components/SideBySideImages.vue';
</script>

# Config: UI Base `ui-base`

## Properties

<PropsTable :hide-dynamic="true"/>

## Title Bar Style Options <AddedIn version="1.10.0" />

### Title Bar - Default

The title bar will appear as the first element, and scroll _with_ the content, meaning that on longer pages, the title bar will not be visible when the page is scrolled.

![Example of how the 'Default' option looks](/images/node-examples/ui-base-appbar-default.png "Example of how the 'Default' option looks"){data-zoomable}
_Example of how the 'Default' option looks_

### Title Bar - Fixed

The title bar will _always_ be visible, even when the page is scrolled. This is useful for when you want to always have access to the title bar, regardless of the page's length.

![Example of how the 'Fixed' option looks](/images/node-examples/ui-base-appbar-fixed.png "Example of how the 'Fixed' option looks"){data-zoomable}
_Example of how the 'Fixed' option looks_

### Title Bar - Hidden

The title bar is not visible at all. Note that it is still possible to see the navigation menu in this state by choosing the [Fixed](#fixed) option.

![Example of how the 'Hidden' option looks](/images/node-examples/ui-base-appbar-hidden.png "Example of how the 'Hidden' option looks"){data-zoomable}
_Example of how the 'Hidden' option looks_



## Navigation Style Options <AddedIn version="1.2.0" />

### Navigation - Collapsing (default)

<SideBySideImages
    caption="Example of how the 'Collapsing' option looks when open (left) and closed (right)."
    left="/images/node-examples/ui-base-layout-default-open.png"
    right="/images/node-examples/ui-base-layout-sidebar-closed.png"
/>

This open will shift the entire content of the Dashboard when opened, and not be visible at all when closed.

### Navigation - Fixed

![Example of how the 'Fixed' option looks at all times](/images/node-examples/ui-base-layout-fixed.png "Example of how the 'Fixed' option looks at all times"){data-zoomable}
_Example of how the 'Fixed' option looks at all times_

Will always remain open. At our mobile breakpoint (768px), this value is overridden, and an "Appear Over" option is used. Note that at mobile-scale (screen width less than 768px), then the Fixed layout will revert back to the "Default" option.

### Navigation - Collapse to Icons

Similar to "Collapsing" when opened, but when closed, the icons for each page still show.

<SideBySideImages
    caption="Example of how the 'Collapsing' option looks when open (left) and closed (right)."
    left="/images/node-examples/ui-base-layout-default-open.png"
    right="/images/node-examples/ui-base-layout-icon-closed.png"
/>

### Navigation - Appear over Content

<SideBySideImages
    caption="Example of how the 'Collapsing' option looks when open (left) and closed (right)."
    left="/images/node-examples/ui-base-layout-over-open.png"
    right="/images/node-examples/ui-base-layout-sidebar-closed.png"
/>

Not visible when closed, and when open, will appear over the Dashboard content, without shifting it.

### Navigation - Always Hide

![Example of how the 'Always Hide' option looks](/images/node-examples/ui-base-layout-hide.png "Example of how the 'Always Hide' option looks"){data-zoomable}
_Example of how the 'Always Hide' option looks_

The sidebar will not be visible under any circumstances. All pages are still accessible via their direct links or a [ui-control](../widgets/ui-control.md) node.