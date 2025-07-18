export default function singletonFactory<T>(creator: () => T): () => T {
    let instance: T
    return () => {
        if (!instance) {
            instance = creator()
        }
        return instance
    }
}
