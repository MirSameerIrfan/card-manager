import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/example/example3')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/example/example3"!</div>
}
