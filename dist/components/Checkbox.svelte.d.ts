type $$ComponentProps = {
    checked: boolean;
    onchange?: (value: boolean) => void;
};
declare const Checkbox: import("svelte").Component<$$ComponentProps, {}, "checked">;
type Checkbox = ReturnType<typeof Checkbox>;
export default Checkbox;
