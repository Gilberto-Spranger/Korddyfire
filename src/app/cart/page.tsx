"use client";
import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { items: cartItems, removeItem, updateQuantity, getTotal } = useCart();
  const router = useRouter();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <ShoppingCart className="w-16 h-16 text-gray-400" />
        <h1 className="mt-4 text-2xl font-semibold">Seu carrinho está vazio</h1>
        <p className="mt-2 text-gray-500">Adicione produtos para começar.</p>
        <Button onClick={() => router.push('/home')} color="primary" className="mt-6 rounded-xl">
          Continuar Comprando
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Seu Carrinho</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cartItems.map((item) => (
          <Card key={item.id} shadow="sm" className="rounded-2xl">
            <CardHeader className="p-0 relative w-full h-48">
              <Image src={item.image} alt={item.name} fill className="object-cover rounded-t-2xl" />
            </CardHeader>
            <CardBody>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
              <p className="text-xs text-gray-400 capitalize mt-1">Tipo: {item.type}</p>
            </CardBody>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button size="sm" isIconOnly variant="flat" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold">{item.quantity}</span>
                <Button size="sm" isIconOnly variant="flat" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="light" color="danger" isIconOnly onClick={() => removeItem(item.id)} className="rounded-full">
                <Trash2 className="w-5 h-5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Resumo do carrinho */}
      <div className="mt-10 max-w-lg mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Resumo da Compra</h2>
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>R$ {getTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-700 mt-2">
          <span>Frete (Físicos)</span>
          <span>R$ {cartItems.some(i => i.type === 'physical') ? '20.00' : '0.00'}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>
            R$ {(getTotal() + (cartItems.some(i => i.type === 'physical') ? 20 : 0)).toFixed(2)}
          </span>
        </div>
        <Button onClick={() => router.push('/checkout')} color="success" className="w-full mt-6 rounded-xl py-3 font-semibold text-white">
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
}