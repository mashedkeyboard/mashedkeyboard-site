<script lang="ts">
    export let data: string;
    export let alt: string = "";

    const ogData = JSON.parse(data) as OgObject;
</script>

<a href={ogData.ogUrl} target="_blank">
    <img src={ogData.ogImage[0].url} alt={alt || ogData.ogDescription || "The Open Graph link image for this link."} />
    <span>
        <span>{ogData.ogTitle}</span>
        <p>{ogData.ogDescription || ""}</p>
    </span>
</a>

<style lang="scss">
a {
    display: block;
    width: 100%;
    overflow: hidden;

    img {
        max-width: 100%;
        display: block;
    }

    > span {
        background: $primary;
        color: $light;
        width: 100%;
        padding: 1em;
        display: block;

        span {
            font-weight: bold;
            font-size: 1.3em;
            display: block;
        }

        p {
            margin-bottom: 0;
        }
    }
}
</style>