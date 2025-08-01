declare const Checkbox: import("svelte").Component<{
    checked?: boolean;
    onchange: any;
}, {}, "checked">;
type Checkbox = ReturnType<typeof Checkbox>;
export default Checkbox;
