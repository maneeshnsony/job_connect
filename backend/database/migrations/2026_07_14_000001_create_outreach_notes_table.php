<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('outreach_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outreach_id')->constrained()->cascadeOnDelete();
            $table->text('note');
            $table->timestamps();

            $table->index(['outreach_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('outreach_notes');
    }
};
