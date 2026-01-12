import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/example/example2')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/example/example2"!</div>
}
