import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../../../Backend/Services/User/Auth.Service';
import { MessageService } from '../../../../../Backend/Services/message.Service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../../Backend/Services/theme.service';
import { ContactService } from '../../../../../Backend/Services/contact.service';
import { Icon } from '../../../priver/icon/icon';

@Component({
    selector: 'app-message',
    standalone: true,
    imports: [CommonModule, FormsModule, Icon],
    templateUrl: './message.html',
    styleUrl: './message.css',
})
export class Message implements OnInit {

    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

    // =============================
    // USER CONNECTÉ
    // =============================
    user: any = null;

    // =============================
    // USERS / CONTACTS
    // =============================
    users: any[] = [];
    selectedUsers: any[] = [];
    filteredUsers: any[] = [];

    // =============================
    // STATE CHAT
    // =============================
    selectedUser: any = null;
    messages: any[] = [];
    newMessage: string = '';
    loadingConversation = false;
    isSending: boolean = false;

    // =============================
    // SEARCH
    // =============================
    searchText: string = '';

    // =============================
    // NOTIFICATIONS
    // =============================
    showNotification: boolean = false;
    notificationMessage: string = '';

    constructor(
        private authService: AuthService,
        private messageService: MessageService,
        public themeService: ThemeService,
        private contactService: ContactService
    ) { }

    // =============================
    // INIT
    // =============================
    ngOnInit(): void {

        const userData = localStorage.getItem('utilisateur');

        if (userData) {
            this.user = JSON.parse(userData);
            // console.log('✅ User connecté :', this.user);
        }

        this.loadUsers();
        this.loadContacts();
    }

    // =============================
    // LOAD ALL USERS
    // =============================
    loadUsers() {

        this.authService.getAllUsers().subscribe({
            next: (res: any) => {

                const allUsers = res || [];

                this.users = allUsers.filter(
                    (u: any) => u.key !== this.user?.key
                );
            },
            error: (err) => console.error('❌ users error', err)
        });
    }

    // =============================
    // LOAD CONTACTS (MongoDB)
    // =============================
    loadContacts() {

        if (!this.user?.key) return;

        this.contactService.getContacts(this.user.key).subscribe({
            next: (res: any) => {
                this.selectedUsers = res || [];
            },
            error: (err) => console.error('❌ contacts error', err)
        });
    }

    // =============================
    // FILTER USERS
    // =============================
    filterUsers() {

        const text = this.searchText.toLowerCase().trim();

        if (!text) {
            this.filteredUsers = [];
            return;
        }

        this.filteredUsers = this.users.filter(u =>
            `${u.prenom} ${u.nom}`.toLowerCase().includes(text) &&
            !this.selectedUsers.find(s => s.key === u.key)
        );
    }

    // =============================
    // ADD CONTACT
    // =============================
    addUser(user: any) {

        if (!this.user?.key) return;

        this.contactService.addContact({
            userId: this.user.key,
            contactId: user.key
        }).subscribe({

            next: () => {
                this.loadContacts();
                this.searchText = '';
                this.filteredUsers = [];
            },

            error: (err) => console.error(err)
        });
    }

    // =============================
    // REMOVE CONTACT
    // =============================
    removeUser(user: any, event: Event) {

        event.stopPropagation();

        this.contactService.removeContact({
            userId: this.user.key,
            contactId: user.key
        }).subscribe(() => {

            this.selectedUsers = this.selectedUsers.filter(
                u => u.key !== user.key
            );

            if (this.selectedUser?.key === user.key) {
                this.selectedUser = null;
                this.messages = [];
            }
        });
    }

    // =============================
    // SELECT USER
    // =============================
    selectUser(user: any) {
        this.selectedUser = user;
        this.loadConversation();
    }

    // =============================
    // LOAD CONVERSATION
    // =============================
    loadConversation() {

        if (!this.user?.key || !this.selectedUser?.key) return;

        this.loadingConversation = true;

        this.messageService.recupererConversation(
            this.user.key,
            this.selectedUser.key
        ).subscribe({

            next: (res: any) => {

                // 🔥 LOG COMPLET DE LA CONVERSATION
                // console.log('📩 Conversation complète :', res);

                this.messages = res || [];
                this.loadingConversation = false;
            },

            error: (err) => {
                console.error('❌ Erreur conversation :', err);
                this.loadingConversation = false;
            }
        });
    }



// =============================
// SHOW NOTIFICATION
// =============================
showToast(message: string) {

    this.notificationMessage = message;
    this.showNotification = true;

    // Auto close après 3 sec
    setTimeout(() => {
        this.showNotification = false;
    }, 3000);
}

// =============================
// SEND MESSAGE
// =============================
sendMessage() {

    if (!this.newMessage.trim() || !this.selectedUser) return;

    this.isSending = true;

    const msg = {
        texte: this.newMessage.trim(),
        expediteurId: this.user.key,
        destinataireId: this.selectedUser.key
    };

    this.messageService.sendMessage(msg).subscribe({

        next: (res: any) => {

            this.messages.push(res);

            this.newMessage = '';

            this.isSending = false;

            // ✅ NOTIFICATION
            this.showToast('Message envoyé avec succès');

            setTimeout(() => this.scrollToBottom(), 100);
        },

        error: () => {

            this.isSending = false;

            this.showToast('Erreur lors de l’envoi du message');
        }
    });
}


    setElementColor(event: MouseEvent, color: string, background: string) {
        const element = event.currentTarget as HTMLElement;

        element.style.color = color;
        element.style.background = background;
    }



    closeNotification(): void {
        this.showNotification = false;
    }

    // =============================
    // SCROLL
    // =============================
    scrollToBottom() {
        try {
            const el = this.scrollContainer?.nativeElement;
            if (el) el.scrollTop = el.scrollHeight;
        } catch { }
    }

    // =============================
    // ENTER SEND
    // =============================
    onEnter(event: Event): void {
        const e = event as KeyboardEvent;

        e.preventDefault(); // empêche saut de ligne

        this.sendMessage();
    }

    setInputFocus(event: Event): void {
        const el = event.target as HTMLTextAreaElement;
        el.style.boxShadow = "0 0 0 2px rgba(16,185,129,0.3)";
    }

    setInputBlur(event: Event): void {
        const el = event.target as HTMLTextAreaElement;
        el.style.boxShadow = "none";
    }

    // Gestion du hover des boutons
    setBtnHover(event: Event, bg: string, color: string): void {
        const el = event.currentTarget as HTMLElement;
        el.style.background = bg;
        el.style.color = color;
    }

    // Focus/Blur sur l'input avec glow
    onInputFocus(event: Event): void {
        const el = event.target as HTMLElement;
        el.style.borderColor = this.themeService.convocationPrimary;
        el.style.boxShadow = `0 0 0 3px ${this.themeService.convocationPrimary}33, 0 4px 12px ${this.themeService.convocationPrimary}22`;
    }

    onInputBlur(event: Event): void {
        const el = event.target as HTMLElement;
        el.style.borderColor = this.themeService.GlassBorder;
        el.style.boxShadow = 'none';
    }

    // Auto-resize du textarea
    autoResize(event: Event): void {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px'; // max 128px
    }

    // =============================
    // CHECK MESSAGE OWNER
    // =============================
    isMyMessage(msg: any): boolean {

        const myKey = this.user?.key;

        const senderKey =
            msg?.expediteurId?._id ||
            msg?.expediteurId?.key ||
            msg?.expediteurId ||
            msg?.expediteur?._id ||
            msg?.expediteur?.key;

        return String(senderKey) === String(myKey);
    }

    // =============================
    // DATE FORMAT
    // =============================
    formatDate(date: string): string {
        return date ? new Date(date).toLocaleString('fr-FR') : '';
    }
}