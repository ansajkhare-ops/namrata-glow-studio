'use server'
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteMessage(rawId) {
  try {
    const id = parseInt(rawId, 10);
    await prisma.message.delete({ where: { id } });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Failed to delete message" };
  }
}

export async function toggleMessageStatus(rawId, currentStatus) {
  try {
    const id = parseInt(rawId, 10);
    const newStatus = currentStatus === 'UNREAD' ? 'REPLIED' : 'UNREAD';
    await prisma.message.update({
      where: { id },
      data: { status: newStatus }
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Update Error:", error);
    return { error: "Failed to update status" };
  }
}
