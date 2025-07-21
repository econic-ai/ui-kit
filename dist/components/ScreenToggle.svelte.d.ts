type $$ComponentProps = {
    left?: string;
    right?: string;
    checked: boolean;
    onchange?: (checked: boolean) => void;
};
declare const ScreenToggle: import("svelte").Component<$$ComponentProps, {}, "checked">;
type ScreenToggle = ReturnType<typeof ScreenToggle>;
export default ScreenToggle;
