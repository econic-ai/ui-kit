interface Props {
    html: string;
    x: number;
    y: number;
    onmouseenter: (event: any) => void;
    onmouseleave: (event: any) => void;
}
declare const Tooltip: import("svelte").Component<Props, {}, "">;
type Tooltip = ReturnType<typeof Tooltip>;
export default Tooltip;
