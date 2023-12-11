const fs = require("fs").promises;

class ProductManager {
    static lastId = 0;

    constructor(path) {
        this.path = path;
        this.products = [];
    }
    async addProduct(nuevoObjeto) {
        const { title, description, price, thumbnail, code, stock } = nuevoObjeto;
    
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log("Faltan campos obligatorios para agregar el producto");
            return;
        }
    
        if (this.products.some(item => item.code === code)) {
            console.log("El código de producto no puede repetirse");
            return;
        }
    
        const existingProduct = this.products.find(item => item.id === nuevoObjeto.id);
    
        if (existingProduct) {
            console.log("El ID de producto ya existe. No se puede agregar el producto.");
            return;
        }
    
        const newProduct = {
            id: ++ProductManager.lastId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
    
        this.products.push(newProduct);
        await this.guardarArchivo(this.products);
        console.log("Producto agregado correctamente");
    }
    

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
            } else {
                console.log("Producto encontrado:", buscado);
                return buscado;
            }

        } catch (error) {
            console.log("Error al buscar el producto por ID", error);
        }
    }

    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();

            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
                console.log("Producto actualizado correctamente");
            } else {
                console.log("No se encontró el producto para actualizar");
            }

        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }

    async getProducts() {
        try {
            const arrayProductos = await this.leerArchivo();
            console.log("Listado de productos:", arrayProductos);
        } catch (error) {
            console.log("Error al obtener el listado de productos", error);
        }
    }

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {
            console.log("Error al leer el archivo", error);
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            const latestProducts = Array.isArray(arrayProductos[arrayProductos.length - 1])
                ? arrayProductos[arrayProductos.length - 1]
                : arrayProductos;
    
            await fs.writeFile(this.path, JSON.stringify(latestProducts, null, 2), "utf-8");
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }
}
     

// Testing:

async function test() {
    const manager = new ProductManager("./productos.json");

    await manager.getProducts();

    const choclo = {
        title: "choclo",
        description: "un choclo",
        price: 150,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 30
    }

    await manager.addProduct(choclo);

    const zapato = {
        title: "Zapato",
        description: "De la mejor talla",
        price: 250,
        thumbnail: "Sin imagen",
        code: "abc124",
        stock: 30
    }

    await manager.addProduct(zapato);

    const perro = {
        id: 1,
        title: "perro",
        description: "ta' bonito",
        price: 150,
        thumbnail: "Sin imagen",
        code: "abc123",
        stock: 30
    };

    await manager.updateProduct(1, perro);

    await manager.getProducts();

    await manager.getProductById(2);
}

test();
