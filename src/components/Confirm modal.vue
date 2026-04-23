<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h3>Delete Article?</h3>
      <p>This action cannot be undone. Are you sure you want to remove <strong>{{ title }}</strong>?</p>
      
      <div class="modal-actions">
        <button class="cancel-btn" @click="$emit('cancel')">Keep it</button>
        <button class="confirm-btn" @click="$emit('confirm')">Delete Forever</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['isOpen', 'title']);
defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
h3 { color: #1c2a32; margin-bottom: 1rem; }
p { color: #666; margin-bottom: 2rem; line-height: 1.5; }
.modal-actions { display: flex; gap: 1rem; justify-content: center; }
.cancel-btn { background: #eee; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; }
.confirm-btn { background: #c62828; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600; }
</style>
