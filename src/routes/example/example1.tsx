import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/example/example1')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/example/example1"!</div>
}
