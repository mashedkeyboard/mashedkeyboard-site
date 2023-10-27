<script lang="ts">
    import {library, icon as iconCore} from '@fortawesome/fontawesome-svg-core';
    import type {IconDefinition, IconParams} from '@fortawesome/fontawesome-svg-core';
    import '@fortawesome/fontawesome-svg-core/styles';

    export let icon: IconDefinition;
    export let opts: IconParams = {};

    library.add(icon);
</script>

{@html iconCore(icon, opts)?.html}